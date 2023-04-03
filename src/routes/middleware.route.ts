import { Router } from 'express';
import { middlewareController } from '../controllers';

const router: Router = Router();

router.use(middlewareController.authorization);

export const middlewareRouter: Router = router;
