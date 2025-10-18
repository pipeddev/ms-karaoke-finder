import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { IsUUID4 } from 'src/shared/decorator/is-uuid4.decorator';

export class IssueTokenDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @IsUUID4()
  deviceId!: string;
}
