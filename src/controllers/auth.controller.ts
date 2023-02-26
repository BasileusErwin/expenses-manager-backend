import { Request, Response, NextFunction } from 'express';
import { CustomResponse } from '../lib/custom_response.lib';
import { AuthService } from '../services/auth.service';

interface LoginRequest {
  email: string;
  password: string;
}

const authService: AuthService = new AuthService();

export class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: LoginRequest = req.body;

      const response = await authService.login(email, password);

      return res.send(new CustomResponse(true, response));
    } catch (err) {
      next(err);
    }
  }
}
