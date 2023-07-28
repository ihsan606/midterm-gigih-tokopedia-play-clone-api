import { Router } from 'express';
import * as UserController from './user.controller';
import { validateRequest } from '../../middlewares';
import { User } from './user.model';

const router = Router();


router.post('/', validateRequest({
  body: User,
}), UserController.createOne);
router.get('/:id', UserController.findOne);

export default router;



