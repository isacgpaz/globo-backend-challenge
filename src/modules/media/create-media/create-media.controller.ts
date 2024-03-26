import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AccessLevel, MediaType, ParentalRating } from "@prisma/client";
import { dayjs } from "src/lib/dayjs";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { CreateMediaUseCase } from "./create-media-use-case";

const createMedia = z.object({
  title: z.string({
    required_error: 'Título é obrigatório.',
    invalid_type_error: 'Título é obrigatório.',
  })
    .min(1, 'Título é obrigatório.'),
  description: z.string({
    required_error: 'Descrição é obrigatória.',
    invalid_type_error: 'Descrição é obrigatória.',
  })
    .min(1, 'Descrição é obrigatória.'),
  releaseDate: z
    .string({
      required_error: 'Data de lançamento é obrigatória.',
      invalid_type_error: 'Data de lançamento é obrigatória.',
    })
    .refine(
      (releaseDate) => {
        if (!releaseDate) return false;

        return dayjs(releaseDate, 'YYYY-MM-DDTHH:MM').isValid();
      },
      {
        message: 'Data de lançamento inválida.',
      },
    ),
  parentalRating: z.nativeEnum(ParentalRating, {
    invalid_type_error: 'Nível de acesso é obrigatório.',
    required_error: 'Nível de acesso é obrigatório.'
  }),
  type: z.nativeEnum(MediaType, {
    invalid_type_error: 'Tipo de mídia é obrigatório.',
    required_error: 'Tipo de mídia é obrigatório.'
  }),
  artistsIds: z.array(z.string({
    invalid_type_error: 'Artista é obrigatório.',
    required_error: 'Artista é obrigatório.'
  })
    .min(1, 'Artistas são obrigatórios.'
    ))
    .min(1, 'Artistas são obrigatórios.'),
  categoriesIds: z.array(z.string({
    invalid_type_error: 'Categoria é obrigatório.',
    required_error: 'Categoria é obrigatório.'
  })
    .min(1, 'Categorias são obrigatórios.'
    ))
    .min(1, 'Artistas são obrigatórios.'),
  directorId: z.string({
    invalid_type_error: 'Diretor é obrigatório.',
    required_error: 'Diretor é obrigatório.'
  }).min(1, 'Diretor é obrigatórios.'),
  movie: z.object({
    duration: z.number()
      .int('A duração deve ser um número inteiro.')
      .positive('A duração deve ser um número positivo'),
  }).optional(),
  serie: z.object({
    seasons: z.array(z.object({
      episodes: z.array(z.object({
        title: z.string({
          required_error: 'Título é obrigatório.',
          invalid_type_error: 'Título é obrigatório.',
        })
          .min(1, 'Título é obrigatório.'),
        description: z.string({
          required_error: 'Descrição é obrigatória.',
          invalid_type_error: 'Descrição é obrigatória.',
        })
          .min(1, 'Descrição é obrigatória.'),
        duration: z.number()
          .int('A duração deve ser um número inteiro.')
          .positive('A duração deve ser um número positivo')
      }))
    })
    )
  }).optional()
});

type CreateMedia = z.infer<typeof createMedia>;

@Controller('/media')
export class CreateMediaController {
  constructor(private readonly createMediaUseCase: CreateMediaUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createMedia))
  async handle(@Body() createMedia: CreateMedia) {
    const result = await this.createMediaUseCase.execute(createMedia);
    return result;
  }
}