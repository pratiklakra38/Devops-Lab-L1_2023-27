import request from 'supertest';
import app from '../server';
import prisma from '../db/prisma';

describe('SocialSphere API Tests', () => {
  let testPostId = '';

  beforeAll(async () => {
    // Ensure database connection is healthy
    await prisma.$queryRaw`SELECT 1`;
  });

  afterAll(async () => {
    // Clean up test data if any was created under custom test identifiers
    // We can delete posts created by test users, etc.
    await prisma.comment.deleteMany({
      where: { userId: 'user-daniel', content: 'Test Comment Content' },
    });
    if (testPostId) {
      await prisma.like.deleteMany({ where: { postId: testPostId } });
      await prisma.comment.deleteMany({ where: { postId: testPostId } });
      await prisma.post.delete({ where: { id: testPostId } });
    }
    await prisma.$disconnect();
  });

  // 1. Health & Readiness endpoints
  describe('GET /health & /ready', () => {
    it('should return 200 OK for /health probe', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });

    it('should return 200 OK for /ready probe', async () => {
      const res = await request(app).get('/ready');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ready' });
    });
  });

  // 2. Posts API
  describe('POST & GET /api/posts', () => {
    it('should fail to create a post if fields are missing or invalid', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ userId: 'user-alex', content: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('BAD_REQUEST');
    });

    it('should fail to create a post if user does not exist', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ userId: 'non-existent-user-id', content: 'Hello social world!' });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('USER_NOT_FOUND');
    });

    it('should create a post successfully', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ userId: 'user-alex', content: 'Testing post endpoint creation!' });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.content).toBe('Testing post endpoint creation!');
      expect(res.body.author.name).toBe('Alex Morgan');
      testPostId = res.body.id; // Save for subsequent tests
    });

    it('should retrieve list of posts with pagination and authors', async () => {
      const res = await request(app)
        .get('/api/posts')
        .query({ page: 1, limit: 10 })
        .set('x-user-id', 'user-alex');

      expect(res.status).toBe(200);
      expect(res.body.posts).toBeDefined();
      expect(res.body.posts.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(10);
      
      const firstPost = res.body.posts[0];
      expect(firstPost.id).toBeDefined();
      expect(firstPost.content).toBeDefined();
      expect(firstPost.author.name).toBeDefined();
      expect(firstPost.likesCount).toBeDefined();
      expect(firstPost.commentsCount).toBeDefined();
      expect(typeof firstPost.likedByCurrentUser).toBe('boolean');
    });
  });

  // 3. Likes API
  describe('POST & DELETE /api/posts/:postId/like', () => {
    it('should like a post successfully', async () => {
      const res = await request(app)
        .post(`/api/posts/${testPostId}/like`)
        .send({ userId: 'user-sarah' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify the count in database
      const postFromDb = await prisma.post.findUnique({
        where: { id: testPostId },
        include: { _count: { select: { likes: true } } },
      });
      expect(postFromDb?._count.likes).toBe(1);
    });

    it('should return 409 when liking a post twice', async () => {
      const res = await request(app)
        .post(`/api/posts/${testPostId}/like`)
        .send({ userId: 'user-sarah' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('LIKE_ALREADY_EXISTS');
    });

    it('should unlike a post successfully', async () => {
      const res = await request(app)
        .delete(`/api/posts/${testPostId}/like`)
        .send({ userId: 'user-sarah' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify the count is 0 now
      const postFromDb = await prisma.post.findUnique({
        where: { id: testPostId },
        include: { _count: { select: { likes: true } } },
      });
      expect(postFromDb?._count.likes).toBe(0);
    });

    it('should return success and exit cleanly when unliking a post that is not liked', async () => {
      const res = await request(app)
        .delete(`/api/posts/${testPostId}/like`)
        .send({ userId: 'user-sarah' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // 4. Comments API
  describe('POST & GET /api/posts/:postId/comments', () => {
    it('should add a comment successfully', async () => {
      const res = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .send({ userId: 'user-daniel', content: 'Test Comment Content' });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.content).toBe('Test Comment Content');
      expect(res.body.author.name).toBe('Daniel Kim');
    });

    it('should fail to add an empty comment', async () => {
      const res = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .send({ userId: 'user-daniel', content: '   ' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_CONTENT');
    });

    it('should retrieve comments for a post', async () => {
      const res = await request(app).get(`/api/posts/${testPostId}/comments`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].content).toBe('Test Comment Content');
      expect(res.body[0].author.name).toBe('Daniel Kim');
    });
  });
});
