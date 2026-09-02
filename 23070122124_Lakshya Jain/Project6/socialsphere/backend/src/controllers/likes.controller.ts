import { Request, Response, NextFunction } from 'express';
import { LikesService } from '../services/likes.service';
import { z } from 'zod';

const likeSchema = z.object({
  userId: z.string({ required_error: 'userId is required' }).min(1, 'userId cannot be empty'),
});

export class LikesController {
  static async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      
      // Support finding userId from body or x-user-id header
      const userId = req.body.userId || req.headers['x-user-id'];
      
      const parseResult = likeSchema.safeParse({ userId });
      if (!parseResult.success) {
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: parseResult.error.errors[0].message,
          },
        });
      }

      await LikesService.likePost(postId, parseResult.data.userId);
      return res.status(200).json({ success: true });
    } catch (error) {
      return next(error);
    }
  }

  static async unlikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;

      // In a DELETE request, userId might be in headers or query parameters
      const userId = req.body.userId || req.headers['x-user-id'] || req.query.userId;

      const parseResult = likeSchema.safeParse({ userId });
      if (!parseResult.success) {
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: parseResult.error.errors[0].message,
          },
        });
      }

      await LikesService.unlikePost(postId, parseResult.data.userId);
      return res.status(200).json({ success: true });
    } catch (error) {
      return next(error);
    }
  }
}
