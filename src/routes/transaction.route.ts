/* eslint-disable @typescript-eslint/no-misused-promises,@typescript-eslint/unbound-method */
import { Router } from 'express';
import { TransactionController } from '../controllers';
import { TransactionValidation } from '../validations';

const router: Router = Router();

const transactionController: TransactionController = new TransactionController();

router
  .route('/')
  .get(transactionController.getAllTransactionsByUserId)
  .post(transactionValidation.createTransaction, transactionController.createTransaction);

router.route('/:transactionId').get(transactionController.getAllTransactionsByUserId);

export const transactionRouter: Router = router;
