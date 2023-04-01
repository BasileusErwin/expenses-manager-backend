import { randomBytes } from 'crypto';
import { ApiError } from '../enums';
import { UserDTO } from '../types/DTOs';
import { CustomError, logger } from '../lib';
import { PasswordUtil } from '../utils';
import { SessionModel } from '../models';
import { UserService } from '.';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async login(email: string, password: string): Promise<{ token: string; user: UserDTO }> {
    logger.info(`Login email: ${email}`);
    const user: UserDTO = await this.userService.getUser({ email });

    if (!user) {
      logger.error('User does not exist');
      throw new CustomError(ApiError.User.USER_DOES_NOT_EXIST);
    }

    if (!(await PasswordUtil.comparePassword(user.password, password))) {
      throw new CustomError(ApiError.Auth.BAD_AUTH);
    }

    await SessionModel.destroy({
      where: {
        userId: user.userId,
      },
    });

    const token: string = await new Promise<string>((resolve, reject) =>
      randomBytes(50, (err, buffer) => {
        if (err) {
          throw reject(err);
        }
        resolve(buffer.toString('hex'));
      }),
    );

    await SessionModel.create({
      userId: user.userId,
      token,
    });

    return { token, user };
  }
}
