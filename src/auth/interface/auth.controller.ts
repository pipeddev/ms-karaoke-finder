import { Controller, Post, Body } from '@nestjs/common';
import { IssueTokenDto } from './dto/issue-token.dto';
import { IssueTokenUseCase } from '../application/use-cases/issue-token.usecase';

@Controller('auth')
export class AuthController {
  constructor(private readonly issueTokenUseCase: IssueTokenUseCase) {}

  @Post('token')
  async issueToken(@Body() issueTokenDto: IssueTokenDto) {
    return this.issueTokenUseCase.execute(issueTokenDto);
  }
}
