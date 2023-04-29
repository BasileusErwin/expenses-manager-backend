import { Router } from 'express';
import { middlewareController, financialGoalController } from '../controllers';
import { financialGoalValidation } from '../validations';

const router: Router = Router();

router
  .route('/')
  .all(middlewareController.onlyLogin)
  .get(financialGoalController.getAllFinancialGoals)
  .post(financialGoalValidation.createFinancialGoal, financialGoalController.createFinancialGoal);

router
  .route('/:goalId')
  .all(middlewareController.onlyLogin, financialGoalValidation.getFinancialGoal)
  .get(financialGoalController.getFinancialGoalById);

export const financialGoalRouter: Router = router;
