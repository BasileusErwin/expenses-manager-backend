import { Router } from 'express';
import { shoppingListValidation } from '../validations';
import { middlewareController, shoppingListController } from '../controllers';

const router: Router = Router();

router
  .route('/')
  .all(middlewareController.onlyLogin)
  .get(shoppingListController.getAllShoppingList)
  .post(shoppingListValidation.createShoppingList, shoppingListController.createShoppingList);

router
  .route('/:listId')
  .all(middlewareController.onlyLogin)
  .get(shoppingListController.getShoppingList)
  .delete(shoppingListController.deleteShoppingList);

router
  .route('/list/items/:listId')
  .all(middlewareController.onlyLogin)
  .get(shoppingListController.getShoppingListItemByListId);

router
  .route('/list/:listId/:itemId')
  .all(middlewareController.onlyLogin)
  .patch(shoppingListController.checkShoppingListItem);

router
  .route('/item/:itemId')
  .all(middlewareController.onlyLogin)
  .post(
    shoppingListValidation.convertShoppingListItemToTransaction,
    shoppingListController.convertShoppingListItemToTransaction,
  )
  .delete(shoppingListController.deleteShoppingListItem);

export const shoppingListRouter: Router = router;
