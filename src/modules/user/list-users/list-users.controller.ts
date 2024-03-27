import { Controller, Get, HttpCode, Query, UseGuards, UsePipes } from "@nestjs/common";
import { AccessLevel, UserStatus } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { ListUsersUseCase } from "./list-users-use-case";

const listUsers = z.object({
  name: z.string().optional().default(''),
  status: z.nativeEnum(UserStatus).optional(),
  page: z
    .string({
      required_error: 'Número da página é obrigatório',
      invalid_type_error: 'Número da página é obrigatório',
    })
    .refine(
      (data) => typeof Number(data) === 'number',
      'Número da página é obrigatório',
    )
    .transform((data) => Number(data) - 1)
    .refine((data) => data >= 0, 'A página não pode ser menor que 1'),
  rowsPerPage: z
    .string({
      required_error: 'Quantidade por página é obrigatória',
      invalid_type_error: 'Quantidade por página é obrigatória',
    })
    .refine(
      (data) => typeof Number(data) === 'number',
      'Quantidade por página é obrigatória',
    )
    .transform((data) => Number(data)),
});

type ListUsers = z.infer<typeof listUsers>;

@Controller('/users')
export class ListUsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(listUsers))
  async handle(@Query() listUsers: ListUsers) {
    const result = await this.listUsersUseCase.execute(listUsers);
    return result;
  }
}