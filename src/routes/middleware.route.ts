import { Router } from 'express';
import { MiddlewareController } from '../controllers';

const router: Router = Router();
const middlewareController: MiddlewareController = new MiddlewareController();

router.use(middlewareController.authorization);

export const middlewareRouter: Router = router;
