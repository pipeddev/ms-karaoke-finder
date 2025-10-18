import { AuthenticatedUserDTO } from '../dtos/authenticated-user.dto';

export interface AuthenticatedRequest {
  headers: {
    authorization?: string;
    [key: string]: string | string[] | undefined;
  };
  user?: AuthenticatedUserDTO;
}
