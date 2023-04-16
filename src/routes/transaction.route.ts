import { Router } from 'express';
import { middlewareController, transactionController } from '../controllers';
import { transactionValidation } from '../validations';

const router: Router = Router();

router
  .route('/')
  .all(middlewareController.onlyLogin)
  .get(transactionValidation.getTransaction, transactionController.getAllTransactionsByUserId)
  .post(transactionValidation.createTransaction, transactionController.createTransaction);

router
  .route('/total-saving')
  .all(middlewareController.onlyLogin)
  .get(transactionController.getTotalSavings)

router
  .route('/month-by-years')
  .all(middlewareController.onlyLogin)
  .get(transactionController.getMonthsAndYears);

router
  .route('/:transactionId')
  .all(middlewareController.onlyLogin)
  .get(transactionController.getTransactionById)
  .delete(transactionController.deleteTrasactions);

export const transactionRouter: Router = router;
