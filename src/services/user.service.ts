import { ApiError } from '../enums';
import { CustomError } from '../lib';
import { UserModel } from '../models';
import { UserDTO } from '../types/DTOs';
import { RegisterUserRequest } from '../types/request/user';
import { PasswordUtil } from '../utils';
import { plainToInstance } from 'class-transformer';
import { IncludeOptions, WhereOptions } from 'sequelize';

async function getUser(where: WhereOptions<UserModel>, include: IncludeOptions[] = []): Promise<UserDTO> {
  return plainToInstance(UserDTO, await UserModel.findOne({ where, include }));
}

async function createUser(newUser: RegisterUserRequest): Promise<UserDTO> {
  if (await getUser({ email: newUser.email })) {
    throw new CustomError(ApiError.User.USER_ALREADY_EXISTS);
  }

  newUser.password = await PasswordUtil.hashPassword(newUser.password);

  const user = await UserModel.create(newUser);

  return plainToInstance(UserDTO, user);
}

export const userService = {
  getUser,
  createUser,
};
