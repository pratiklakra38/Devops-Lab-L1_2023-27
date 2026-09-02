import { Request, Response, NextFunction } from 'express';
import { CommentsService } from '../services/comments.service';
import { z } from 'zod';

const createCommentSchema = z.object({
  userId: z.string({ required_error: 'userId is required' }).min(1, 'userId cannot be empty'),
  content: z.string({ required_error: 'content is required' }).min(1, 'content cannot be empty').max(280, 'content cannot exceed 280 characters'),
});

export class CommentsController {
  static async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const comments = await CommentsService.getComments(postId);
      return res.status(200).json(comments);
    } catch (error) {
      return next(error);
    }
  }

  static async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const parseResult = createCommentSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: parseResult.error.errors[0].message,
          },
        });
      }

      const { userId, content } = parseResult.data;
      const comment = await CommentsService.createComment(postId, userId, content);
      return res.status(201).json(comment);
    } catch (error) {
      return next(error);
    }
  }
}
