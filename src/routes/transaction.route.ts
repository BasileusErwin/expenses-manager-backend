import { Router } from 'express';
import { MiddlewareController, TransactionController } from '../controllers';
import { transactionValidation } from '../validations';

const router: Router = Router();

const transactionController: TransactionController = new TransactionController();
const middlewareController: MiddlewareController = new MiddlewareController();

router
  .route('/')
  .get(middlewareController.onlyLogin, transactionController.getAllTransactionsByUserId)
  .post(
    middlewareController.onlyLogin,
    transactionValidation.createTransaction,
    transactionController.createTransaction,
  );

router.route('/:transactionId').get(transactionController.getTransactionById);

export const transactionRouter: Router = router;
