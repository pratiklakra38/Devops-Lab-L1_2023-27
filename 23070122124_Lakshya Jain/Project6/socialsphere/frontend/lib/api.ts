const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const CURRENT_USER_ID = 'user-alex';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-user-id': CURRENT_USER_ID,
  };
};

export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export async function getPosts(page = 1, limit = 20): Promise<PostsResponse> {
  const res = await fetch(`${API_URL}/api/posts?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store', // ensures we always fetch fresh feed
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch posts');
  }

  return res.json();
}

export async function createPost(content: string): Promise<Post> {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      userId: CURRENT_USER_ID,
      content,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create post');
  }

  return res.json();
}

export async function likePost(postId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      userId: CURRENT_USER_ID,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to like post');
  }

  return res.json();
}

export async function unlikePost(postId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
    method: 'DELETE',
    headers: getHeaders(),
    body: JSON.stringify({
      userId: CURRENT_USER_ID,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to unlike post');
  }

  return res.json();
}

export async function getComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch comments');
  }

  return res.json();
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  const res = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      userId: CURRENT_USER_ID,
      content,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create comment');
  }

  return res.json();
}
