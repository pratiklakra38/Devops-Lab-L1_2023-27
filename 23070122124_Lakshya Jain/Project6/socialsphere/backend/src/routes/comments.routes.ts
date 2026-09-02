import { Router } from 'express';
import { CommentsController } from '../controllers/comments.controller';

// mergeParams: true allows access to :postId from parent router mounting
const router = Router({ mergeParams: true });

router.get('/', CommentsController.getComments);
router.post('/', CommentsController.createComment);

export default router;
