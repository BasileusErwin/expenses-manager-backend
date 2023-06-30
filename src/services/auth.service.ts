import { userService } from '.';
import { ApiError } from '../enums';
import { CustomError, logger } from '../lib';
import { UserDTO } from '../types/DTOs';
import { PasswordUtil } from '../utils';
import { redisClient, redisKeyLifetime } from '../redis';

async function login(email: string, password: string, sessionId: string): Promise<UserDTO> {
  logger.info(`Login email: ${email}`);
  const user: UserDTO = await userService.getUser({ email });

  if (!user) {
    logger.error('User does not exist');
    throw new CustomError(ApiError.User.USER_DOES_NOT_EXIST);
  }

  if (!(await PasswordUtil.comparePassword(user.password, password))) {
    throw new CustomError(ApiError.Auth.BAD_AUTH);
  }

  await redisClient.set(`user:${sessionId}`, user.userId, {
    EX: redisKeyLifetime,
  });

  await redisClient.del(sessionId);

  return user;
}

async function logout(token: string) {
  await redisClient.del(token);
}

export const authService = {
  login,
  logout,
};
