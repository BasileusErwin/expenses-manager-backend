import { Router } from 'express';
import { authRouter } from './auth.route';
import { middlewareRouter } from './middleware.route';
import { transactionRouter } from './transaction.route';
import { userRouter } from './user.route';

const router: Router = Router();

router.use('/', middlewareRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/transactions', transactionRouter);

export const routerIndex: Router = router;
