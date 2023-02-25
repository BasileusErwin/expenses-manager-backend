import { Router } from 'express';
import { userRouter } from './user.route';
//import { middlewareRouter } from './middleware';

const router: Router = Router();

//router.use('/', middlewareRouter);
router.use('/users', userRouter);

export const routerIndex: Router = router;
