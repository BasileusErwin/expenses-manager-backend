import { userService } from '.';
import { ApiError } from '../enums';
import { CustomError, logger } from '../lib';
import { SessionModel } from '../models';
import { UserDTO } from '../types/DTOs';
import { PasswordUtil } from '../utils';
import { randomBytes } from 'crypto';

async function login(email: string, password: string): Promise<{ token: string; user: UserDTO }> {
  logger.info(`Login email: ${email}`);
  const user: UserDTO = await userService.getUser({ email });

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

async function logout(token: string) {
  await SessionModel.destroy({
    where: {
      token,
    },
  });
}

export const authService = {
  login,
  logout,
};
