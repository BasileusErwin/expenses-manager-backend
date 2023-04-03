import { Router } from 'express';
import { middlewareController, userController } from '../controllers';
import { userValidation } from '../validations';

const router: Router = Router();

router
  .route('/')
  .get(middlewareController.onlyLogin, userController.getUserById)
  .post(userValidation.registerUser, userController.createUser);

export const userRouter: Router = router;
