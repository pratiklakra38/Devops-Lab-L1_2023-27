import { Router } from 'express';
import { LikesController } from '../controllers/likes.controller';

// Using mergeParams: true so that we can access params from parent routers if mounted hierarchically
const router = Router({ mergeParams: true });

router.post('/', LikesController.likePost);
router.delete('/', LikesController.unlikePost);

export default router;
