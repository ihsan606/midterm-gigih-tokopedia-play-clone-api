import express from 'express';
import videos from './videos/video.route';
import users from './users/user.route';
import products from './products/product.route';
import comments from './comments/comment.route';
import MessageResponse from '../interfaces/MessageResponse';
import { getVideoDetails } from '../utils/youtube.util';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/users', users);
router.use('/videos', videos);
router.use('/products', products);
router.use('/comments', comments);

router.get('/youtube', async (req, res) => {
  const youtube = await getVideoDetails(['qy8PxD3alWw']);
  res.json({
    data: youtube?.thumbnails,
  });
});






export default router;
