import { Exclude, Expose, Type } from 'class-transformer';
import { UserDTO } from '..';

@Exclude()
export class SessionDTO {
  @Expose()
  readonly sessionId: string;

  @Expose()
  readonly token: string;

  @Expose()
  readonly deletedAt: Date;

  @Expose()
  readonly userId: string;

  @Type(() => UserDTO)
  @Expose()
  readonly user: UserDTO;
}
