import prisma from '../db/prisma';
import { AppError } from '../middleware/error-handler';

export class LikesService {
  static async likePost(postId: string, userId: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', `User with ID '${userId}' not found`);
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new AppError(404, 'POST_NOT_FOUND', `Post with ID '${postId}' not found`);
    }

    // Check if duplicate like
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      throw new AppError(409, 'LIKE_ALREADY_EXISTS', 'You have already liked this post');
    }

    // Create the like
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    return { success: true };
  }

  static async unlikePost(postId: string, userId: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', `User with ID '${userId}' not found`);
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new AppError(404, 'POST_NOT_FOUND', `Post with ID '${postId}' not found`);
    }

    // Find if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!existingLike) {
      // Handle cleanly by returning success directly without attempting deletion (since it's already not liked)
      return { success: true };
    }

    // Delete the like
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    return { success: true };
  }
}
