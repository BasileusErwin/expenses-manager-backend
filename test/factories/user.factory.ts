import { RegisterUserRequest } from '../../src/types/request/user'
import { genericFactory } from '.'

const user: RegisterUserRequest = {
  email: 'example@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '123'
}

export const userFactory = {
  user,
}
