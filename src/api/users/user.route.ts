import { Router } from 'express';
import * as UserController from './user.controller';
import { validateRequest } from '../../middlewares';
import { LoginValidation, User } from './user.model';

const router = Router();


router.post('/', validateRequest({
  body: User,
}), UserController.createOne);
router.post('/logout', UserController.logout);
router.post('/login', validateRequest({
  body: LoginValidation,
}), UserController.login);
router.get('/:id', UserController.findOne);


export default router;



