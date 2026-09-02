import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './db/prisma';
import postsRouter from './routes/posts.routes';
import likesRouter from './routes/likes.routes';
import commentsRouter from './routes/comments.routes';
import { errorHandler } from './middleware/error-handler';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Health & Readiness Endpoints (Crucial for Kubernetes deployment)
app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok' });
});

app.get('/ready', async (req, res) => {
  try {
    // Check if database is reachable
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ status: 'ready' });
  } catch (error) {
    console.error('Readiness probe failed:', error);
    return res.status(503).json({
      status: 'error',
      message: 'Database is not reachable',
    });
  }
});

// Mount REST API Routers
app.use('/api/posts', postsRouter);
app.use('/api/posts/:postId/like', likesRouter);
app.use('/api/posts/:postId/comments', commentsRouter);

// Global Error Handler Middleware
app.use(errorHandler);

// Only listen if not in testing mode (so Jest can supertest it)
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[server]: SocialSphere backend is running at http://localhost:${port}`);
  });
}

export default app;
