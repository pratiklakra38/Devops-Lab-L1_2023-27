import { Request, Response, NextFunction } from 'express';
import { PostsService } from '../services/posts.service';
import { z } from 'zod';

const createPostSchema = z.object({
  userId: z.string({ required_error: 'userId is required' }).min(1, 'userId cannot be empty'),
  content: z.string({ required_error: 'content is required' }).min(1, 'content cannot be empty').max(280, 'content cannot exceed 280 characters'),
});

export class PostsController {
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      // Look for the user ID in the custom header 'x-user-id'
      const currentUserId = (req.headers['x-user-id'] || req.query.userId) as string | undefined;

      const result = await PostsService.getPosts(page, limit, currentUserId);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate schema
      const parseResult = createPostSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: parseResult.error.errors[0].message,
          },
        });
      }

      const { userId, content } = parseResult.data;
      const post = await PostsService.createPost(userId, content);
      return res.status(201).json(post);
    } catch (error) {
      return next(error);
    }
  }
}
