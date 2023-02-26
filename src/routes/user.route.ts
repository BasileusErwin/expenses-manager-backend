/* eslint-disable @typescript-eslint/no-misused-promises,@typescript-eslint/unbound-method */
import { Router } from 'express';
import { UserController } from '../controllers';
import { userValidation } from '../validations';

const router: Router = Router();

const userController: UserController = new UserController();

router.route('/signup').post(userValidation.registerUser, userController.createUser);

export const userRouter: Router = router;
