import prisma from '../db/prisma';
import { AppError } from '../middleware/error-handler';

export class CommentsService {
  static async getComments(postId: string) {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new AppError(404, 'POST_NOT_FOUND', `Post with ID '${postId}' not found`);
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' }, // Standard ascending order for conversation style
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
    });

    return comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      author: {
        id: c.userId,
        name: c.user.name,
        avatarUrl: c.user.avatarUrl,
      },
    }));
  }

  static async createComment(postId: string, userId: string, content: string) {
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

    const trimmed = content.trim();
    if (!trimmed) {
      throw new AppError(400, 'INVALID_CONTENT', 'Comment content cannot be empty');
    }

    if (trimmed.length > 280) {
      throw new AppError(
        400,
        'CONTENT_TOO_LONG',
        'Comment content cannot exceed 280 characters'
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content: trimmed,
      },
      include: {
        user: true,
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        id: comment.userId,
        name: comment.user.name,
        avatarUrl: comment.user.avatarUrl,
      },
    };
  }
}
