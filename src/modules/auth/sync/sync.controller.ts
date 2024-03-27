import { Controller, Get, HttpCode, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/auth.guard";
import { SyncUseCase } from "./sync-use-case";

@Controller('/auth')
export class SyncController {
  constructor(private readonly syncUseCase: SyncUseCase) { }

  @UseGuards(JwtAuthGuard)
  @Get('/sync')
  @HttpCode(200)
  async handle(@Req() req: RequestWithUser
  ) {
    const result = await this.syncUseCase.execute({
      id: req.user.id
    });

    return result;
  }
}