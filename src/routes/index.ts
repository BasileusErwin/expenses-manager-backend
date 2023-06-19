import { Router } from 'express';
import { authRouter } from './auth.route';
import { categoryRouter } from './category.route';
import { financialGoalRouter } from './financial_goal.route';
import { healthRouter } from './health.route';
import { middlewareRouter } from './middleware.route';
import { transactionRouter } from './transaction.route';
import { userRouter } from './user.route';
import { shoppingListRouter } from './shopping_list.route';

const router: Router = Router();

router.use('/', middlewareRouter);
router.use('/health', healthRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/transactions', transactionRouter);
router.use('/categories', categoryRouter);
router.use('/financial_goals', financialGoalRouter);
router.use('/shopping_lists', shoppingListRouter);

export const routerIndex: Router = router;
