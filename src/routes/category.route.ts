import { Router } from 'express';
import { categoryValidation } from '../validations';
import { categoryController, middlewareController } from '../controllers';

const router: Router = Router();

router
  .route('/')
  .all(middlewareController.onlyLogin)
  .get(categoryController.getAllCategories)
  .post(categoryValidation.createCategory, categoryController.createCategory);

router
  .route('/:categoryId')
  .all(middlewareController.onlyLogin, categoryValidation.getCategory)
  .get(categoryController.getCategoryById)
  .delete(categoryController.deleteCategory);

export const categoryRouter: Router = router;
