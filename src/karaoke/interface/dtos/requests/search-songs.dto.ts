import { IsNotEmpty, IsString } from 'class-validator';

export class SearchSongsDto {
  @IsString()
  @IsNotEmpty()
  artist: string;
}
