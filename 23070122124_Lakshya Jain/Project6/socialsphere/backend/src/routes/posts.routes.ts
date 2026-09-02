import { Router } from 'express';
import { PostsController } from '../controllers/posts.controller';

const router = Router();

router.get('/', PostsController.getPosts);
router.post('/', PostsController.createPost);

export default router;
