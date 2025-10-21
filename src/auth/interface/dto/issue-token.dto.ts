import { IsString, IsNotEmpty } from 'class-validator';
import { IsUUID4 } from 'src/shared/decorator/is-uuid4.decorator';

export class IssueTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID4()
  deviceId!: string;
}
