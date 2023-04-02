import { Router } from 'express';
import { AuthController, MiddlewareController } from '../controllers';
import { userValidation } from '../validations';

const router: Router = Router();

const authController: AuthController = new AuthController();
const middlewareController: MiddlewareController = new MiddlewareController();

router.route('/login').post(userValidation.registerUser, authController.login);

router.route('/logout').get(middlewareController.onlyLogin, authController.logout);

export const authRouter: Router = router;
