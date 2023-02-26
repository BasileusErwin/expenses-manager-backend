export interface BodyRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class RegisterUserRequest {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  public password: string;

  constructor({ email, firstName, lastName, password }: BodyRequest) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
