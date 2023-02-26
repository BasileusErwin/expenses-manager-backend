import { Router } from 'express';
import { authRouter } from './auth.route';
import { userRouter } from './user.route';

const router: Router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

export const routerIndex: Router = router;
