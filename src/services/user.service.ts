import { plainToInstance } from 'class-transformer';
import { UserModel } from '../models';
import { PasswordUtil } from '../utils';
import { ApiError } from '../enums';
import { CustomError } from '../lib';
import { UserDTO } from '../types/DTOs';
import { RegisterUserRequest } from '../types/request/user';
import { IncludeOptions, WhereOptions } from 'sequelize';

export class UserService {
  public async getUser(where: WhereOptions<UserModel>, include: IncludeOptions[] = []): Promise<UserDTO> {
    return await UserModel.findOne({
      where,
      include,
    });
  }

  public async createUser(newUser: RegisterUserRequest): Promise<UserDTO> {
    if (await this.getUser({ email: newUser.email })) {
      throw new CustomError(ApiError.User.USER_ALREADY_EXISTS);
    }

    newUser.password = await PasswordUtil.hashPassword(newUser.password);

    const user = await UserModel.create(newUser);

    return plainToInstance(UserDTO, user);
  }
}
