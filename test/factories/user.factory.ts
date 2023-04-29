import { RegisterUserRequest } from '../../src/types/request/user';

const user: RegisterUserRequest = new RegisterUserRequest({
  email: 'example@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '123',
});

export const userFactory = {
  user,
};
