import { UserDto } from '@api/models/UserDto';

export interface AuditInfoDto {
  by: UserDto;
  at: Date;
}
