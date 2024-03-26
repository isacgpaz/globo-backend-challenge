import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AccessLevel } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { CreateArtistUseCase } from "./create-artist-use-case";

const createArtist = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório.',
    invalid_type_error: 'Nome é obrigatório.',
  })
    .min(1, 'Nome é obrigatório.'),
});

type CreateArtist = z.infer<typeof createArtist>;

@Controller('/artist')
export class CreateArtistController {
  constructor(private readonly createArtistUseCase: CreateArtistUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createArtist))
  async handle(@Body() createArtist: CreateArtist) {
    const result = await this.createArtistUseCase.execute(createArtist);
    return result;
  }
}