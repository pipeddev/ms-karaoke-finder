import { Inject, Injectable } from '@nestjs/common';
import { DeviceEntity } from 'src/auth/domain/entities/device.entity';
import type { AuthRepository } from 'src/auth/domain/repositories/auth.repository';
import { IssueTokenDto } from 'src/auth/interface/dto/issue-token.dto';
import { JSendDTO } from 'src/shared/dtos/jsend.dto';
import { ValidatorUtils } from 'src/shared/utils/validator.utils';

@Injectable()
export class IssueTokenUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: AuthRepository,
    private readonly validatorUtils: ValidatorUtils,
  ) {}

  async execute(dto: IssueTokenDto) {
    await this.validatorUtils.validateOrThrowBusinessError(dto);
    const device = new DeviceEntity(dto.deviceId);
    const token = await this.authRepository.issueToken(device);
    return JSendDTO.success({ token });
  }
}
