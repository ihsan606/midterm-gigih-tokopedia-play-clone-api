import { Router } from 'express';
import * as CommentController from './comment.controller';
import { validateRequest } from '../../middlewares';
import { Comment } from './comment.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';



const router = Router();

router.post('/', validateRequest({
  body: Comment,
}), CommentController.creteOne);
router.get('/video/:id', validateRequest({
  params: ParamsWithId,
}), CommentController.findAllByVideoId);
router.delete('/:id', validateRequest({
  params: ParamsWithId,
}), CommentController.deleteOne);
  



export default router;
