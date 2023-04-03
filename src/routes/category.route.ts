import { Router } from 'express';
import { categoryController, middlewareController } from '../controllers';

const router: Router = Router();

router
  .route('/:categoryId')
  .all(middlewareController.onlyLogin)
  .get(categoryController.getCategory)
  .delete(categoryController.deleteCategory);

export const categoryRouter: Router = router;
