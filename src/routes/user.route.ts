import { Router } from 'express';
import { MiddlewareController, UserController } from '../controllers';
import { userValidation } from '../validations';

const router: Router = Router();

const userController: UserController = new UserController();
const middlewareController: MiddlewareController = new MiddlewareController();

router
  .route('/')
  .get(middlewareController.onlyLogin, userController.getUserById)
  .post(userValidation.registerUser, userController.createUser);

export const userRouter: Router = router;
