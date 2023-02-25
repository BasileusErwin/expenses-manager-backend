import { plainToInstance } from 'class-transformer';
import { UserModel } from '../models';
import { PasswordUtil } from '../utils';
import { ApiError } from '../enums';
import { CustomError } from '../lib';
import { UserDTO } from '../types/DTOs';
import { RegisterUserRequest } from '../types/request/user';

export class UserService {
  public async createUser(newUser: RegisterUserRequest): Promise<UserDTO> {
    if (this.getUserByFilter({ email: newUser.email }, [])) {
      throw new CustomError(ApiError.User.USER_ALREADY_EXISTS)
    }

    newUser.password = await PasswordUtil.hashPassword(newUser.password);

    const user = await UserModel.create(newUser);

    return plainToInstance(UserDTO, user);
  }

  public async getUserByFilter(filter: any, include: any[]): Promise<UserDTO> {
    return await UserModel.findOne({
      where: filter,
      include,
    });
  }
}
