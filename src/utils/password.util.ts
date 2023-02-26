import bcrypt from 'bcrypt';

export class PasswordUtil {
  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public static async comparePassword(hashedPassword: string, password: string) {
    return !password || !hashedPassword ? false : bcrypt.compare(password, hashedPassword);
  }
}
