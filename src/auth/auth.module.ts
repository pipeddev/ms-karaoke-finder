import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Environment } from 'src/shared/config/environment';
import { JwtAuthService } from './infrastructure/jwt/jwt-auth.service';
import { AuthController } from './interface/auth.controller';
import { IssueTokenUseCase } from './application/use-cases/issue-token.usecase';
import { ValidatorUtils } from 'src/shared/utils/validator.utils';

@Module({
  imports: [
    JwtModule.register({
      secret: Environment.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
        algorithm: 'HS256',
        issuer: 'ms-karaoke-finder',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtAuthService,
    {
      provide: 'AuthRepository',
      useClass: JwtAuthService,
    },
    IssueTokenUseCase,
    ValidatorUtils,
  ],
  exports: [JwtAuthService],
})
export class AuthModule {}
