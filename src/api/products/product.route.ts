import { Router } from 'express';
import * as ProductController from './product.controller';
import { validateRequest } from '../../middlewares';
import { Product, ProductManual } from './product.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
const router = Router();

router.post('/load-product-url', ProductController.loadProductUrl);
router.post('/', validateRequest({
  body: Product,
}), ProductController.creteOne);
router.post('/manual', validateRequest({
  body: ProductManual,
}), ProductController.createOneManualy);
router.get('/video/:id', validateRequest({
  params: ParamsWithId,
}), ProductController.findAllByVideoId);
router.delete('/:id', validateRequest({
  params: ParamsWithId,
}), ProductController.deleteOne);


export default router;