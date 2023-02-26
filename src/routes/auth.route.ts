/* eslint-disable @typescript-eslint/no-misused-promises,@typescript-eslint/unbound-method */
import { Router } from 'express';
import { AuthController } from '../controllers';
import { userValidation } from '../validations';

const router: Router = Router();

const authController: AuthController = new AuthController();

router.route('/login').post(userValidation.registerUser, authController.login);

export const authRouter: Router = router;
