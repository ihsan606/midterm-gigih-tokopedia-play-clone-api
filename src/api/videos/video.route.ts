import { Router } from 'express';
import * as VideoController from './video.controller';
import { validateRequest } from '../../middlewares';
import { Video } from './video.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

const router = Router();

router.get('/', VideoController.findAll);
router.get('/:id', VideoController.findOne);
router.post('/', validateRequest({
  body: Video,
}),
VideoController.createOne);
router.put('/:id', validateRequest({
  params: ParamsWithId,
  body: Video,
}),
VideoController.updateOne);
router.delete('/:id', VideoController.deleteOne);

export default router;