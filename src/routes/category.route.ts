import { Router } from 'express';
import { categoryController, middlewareController } from '../controllers';

const router: Router = Router();

router.route('/').all(middlewareController.onlyLogin).get(categoryController.getAllCategories);

router
  .route('/:categoryId')
  .all(middlewareController.onlyLogin)
  .get(categoryController.getCategoryById)
  .delete(categoryController.deleteCategory);

export const categoryRouter: Router = router;
