import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AccessLevel } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { HasRole } from "../shared/role.decorator";
import { SignUpUseCase } from "./sign-up-use-case";

const signUpSchema = z.object({
  name: z.string({
    required_error: 'E-mail é obrigatório.',
    invalid_type_error: 'E-mail é obrigatório.',
  })
    .min(1, 'Nome é obrigatório.'),
  accessLevel: z.nativeEnum(AccessLevel, {
    invalid_type_error: 'Nível de acesso é obrigatório.',
    required_error: 'Nível de acesso é obrigatório.'
  }),
  email: z
    .string({
      required_error: 'E-mail é obrigatório.',
      invalid_type_error: 'E-mail é obrigatório.',
    })
    .email({
      message: 'E-mail inválido.',
    }),
  password: z
    .string({
      required_error: 'Senha é obrigatório.',
      invalid_type_error: 'Senha é obrigatório.',
    })
    .min(8, {
      message: 'A senha deve conter 8 caracteres.',
    }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

@Controller('/auth')
export class SignUpController {
  constructor(private readonly signUpUseCase: SignUpUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Post('/sign-up')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async handle(@Body() signUp: SignUpSchema) {
    const result = await this.signUpUseCase.execute(signUp);
    return result;
  }
}