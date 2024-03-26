import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { SignInUseCase } from "./sign-in-use-case";

const signInSchema = z.object({
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

type SignInSchema = z.infer<typeof signInSchema>;

@Controller('/auth')
export class SignInController {
  constructor(private readonly signInUseCase: SignInUseCase) { }

  @Post('/sign-in')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(signInSchema))
  async handle(@Body() signIn: SignInSchema) {
    const result = await this.signInUseCase.execute(signIn);
    return result;
  }
}