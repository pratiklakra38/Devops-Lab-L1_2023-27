import prisma from '../db/prisma';
import { AppError } from '../middleware/error-handler';

export class PostsService {
  static async getPosts(page: number, limit: number, currentUserId?: string) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: currentUserId
            ? {
                where: { userId: currentUserId },
                select: { userId: true },
              }
            : false,
        },
      }),
      prisma.post.count(),
    ]);

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.userId,
        name: post.user.name,
        avatarUrl: post.user.avatarUrl,
      },
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      likedByCurrentUser: currentUserId
        ? post.likes && post.likes.length > 0
        : false,
    }));

    return {
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async createPost(userId: string, content: string) {
    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', `User with ID '${userId}' not found`);
    }

    // Validate content is not empty
    const trimmed = content.trim();
    if (!trimmed) {
      throw new AppError(400, 'INVALID_CONTENT', 'Post content cannot be empty');
    }

    // Validate character limit (280 characters)
    if (trimmed.length > 280) {
      throw new AppError(
        400,
        'CONTENT_TOO_LONG',
        'Post content cannot exceed 280 characters'
      );
    }

    const post = await prisma.post.create({
      data: {
        userId,
        content: trimmed,
      },
      include: {
        user: true,
      },
    });

    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.userId,
        name: post.user.name,
        avatarUrl: post.user.avatarUrl,
      },
      likesCount: 0,
      commentsCount: 0,
      likedByCurrentUser: false,
    };
  }
}
