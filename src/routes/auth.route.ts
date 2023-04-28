import { Router } from 'express';
import { authController, middlewareController } from '../controllers';
import { userValidation } from '../validations';

const router: Router = Router();

router.route('/login').post(userValidation.loginUser, authController.login);

router.route('/logout').delete(middlewareController.onlyLogin, authController.logout);

export const authRouter: Router = router;
