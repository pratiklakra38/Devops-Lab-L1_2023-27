import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Clean the database in reverse order of dependencies
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned.');

  // 2. Seed Users
  const users = [
    {
      id: 'user-alex',
      name: 'Alex Morgan',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    {
      id: 'user-sarah',
      name: 'Sarah Chen',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: 'user-maya',
      name: 'Maya Patel',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    },
    {
      id: 'user-daniel',
      name: 'Daniel Kim',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel',
    },
    {
      id: 'user-jordan',
      name: 'Jordan Lee',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    },
    {
      id: 'user-emily',
      name: 'Emily Davis',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
    {
      id: 'user-ryan',
      name: 'Ryan Wilson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
    },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: u,
    });
  }
  console.log(`Seeded ${users.length} users.`);

  // 3. Seed Posts (20-30 posts with specific timestamps to make feed order look nice)
  const baseTime = new Date();
  const getPastTime = (hoursAgo: number) => {
    const d = new Date(baseTime);
    d.setHours(d.getHours() - hoursAgo);
    return d;
  };

  const postsData = [
    {
      id: 'post-1',
      userId: 'user-alex',
      content: 'Learning Kubernetes today. Understanding Pods and ReplicaSets is super interesting! 🚀 #cloud',
      createdAt: getPastTime(48),
    },
    {
      id: 'post-2',
      userId: 'user-sarah',
      content: 'Just migrated our main API database to PostgreSQL. The query planner is incredibly smart. Highly recommend indexing foreign keys!',
      createdAt: getPastTime(45),
    },
    {
      id: 'post-3',
      userId: 'user-maya',
      content: 'Building a beautiful UI with Next.js and Tailwind CSS. The flexibility of utility classes is unmatched once you get the hang of it.',
      createdAt: getPastTime(42),
    },
    {
      id: 'post-4',
      userId: 'user-daniel',
      content: 'Is anyone else running load tests with k6? Finding bottleneck issues in our connection pool is surprisingly satisfying.',
      createdAt: getPastTime(38),
    },
    {
      id: 'post-5',
      userId: 'user-jordan',
      content: 'Remember: premature optimization is the root of all evil. Keep your database queries simple first, then optimize the slow ones.',
      createdAt: getPastTime(36),
    },
    {
      id: 'post-6',
      userId: 'user-emily',
      content: 'Excited to speak at the upcoming DevOps meetup about Horizontal Pod Autoscaling (HPA) and resource constraints!',
      createdAt: getPastTime(32),
    },
    {
      id: 'post-7',
      userId: 'user-ryan',
      content: 'Nothing beat the feeling of deleting 500 lines of legacy code and replacing it with a clean Prisma schema.',
      createdAt: getPastTime(30),
    },
    {
      id: 'post-8',
      userId: 'user-alex',
      content: 'Testing health and readiness probes in our local setup. Extremely important to get right before deploying to Kubernetes.',
      createdAt: getPastTime(26),
    },
    {
      id: 'post-9',
      userId: 'user-sarah',
      content: 'Express + TypeScript is still my absolute favorite stack for building quick, reliable, type-safe REST APIs.',
      createdAt: getPastTime(24),
    },
    {
      id: 'post-10',
      userId: 'user-maya',
      content: 'Pro tip: use shadcn/ui components if you want a premium design system without spending weeks custom-building styling.',
      createdAt: getPastTime(22),
    },
    {
      id: 'post-11',
      userId: 'user-daniel',
      content: 'Just configured HPA on my CPU utilization metric. Watching the pods scale up automatically as traffic hits is magic.',
      createdAt: getPastTime(18),
    },
    {
      id: 'post-12',
      userId: 'user-jordan',
      content: 'Stateless backends make horizontal scaling so simple. Do not store files locally! Offload everything to DB/S3.',
      createdAt: getPastTime(16),
    },
    {
      id: 'post-13',
      userId: 'user-emily',
      content: 'What is your go-to CSS setup for dark mode? I love standard system preference queries combined with custom HSL variables.',
      createdAt: getPastTime(14),
    },
    {
      id: 'post-14',
      userId: 'user-ryan',
      content: 'Clean architecture pays off. Separating routes, controllers, and services makes testing APIs with supertest a breeze.',
      createdAt: getPastTime(12),
    },
    {
      id: 'post-15',
      userId: 'user-alex',
      content: 'Working on a new project named SocialSphere. Planning to test load scaling on it very soon. Stay tuned!',
      createdAt: getPastTime(10),
    },
    {
      id: 'post-16',
      userId: 'user-sarah',
      content: 'Always make sure to validate your API inputs. A good Zod schema prevents unexpected runtime errors downstream.',
      createdAt: getPastTime(8),
    },
    {
      id: 'post-17',
      userId: 'user-maya',
      content: 'Lucide icons are so neat and clean. The perfect companion for modern responsive interfaces.',
      createdAt: getPastTime(6),
    },
    {
      id: 'post-18',
      userId: 'user-daniel',
      content: 'Docker containers have revolutionized development. Spinning up a Postgres database with a single line is awesome.',
      createdAt: getPastTime(4),
    },
    {
      id: 'post-19',
      userId: 'user-jordan',
      content: 'TypeScript strict mode is a necessity, not an option. It saves so much debugging time!',
      createdAt: getPastTime(2),
    },
    {
      id: 'post-20',
      userId: 'user-emily',
      content: 'Just deployed the first version of my feed application. What do you all think?',
      createdAt: getPastTime(1),
    },
  ];

  for (const p of postsData) {
    await prisma.post.create({
      data: {
        id: p.id,
        userId: p.userId,
        content: p.content,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
      },
    });
  }
  console.log(`Seeded ${postsData.length} posts.`);

  // 4. Seed Likes (deterministic and unique per user/post)
  const likesData = [
    { postId: 'post-1', userId: 'user-sarah' },
    { postId: 'post-1', userId: 'user-maya' },
    { postId: 'post-1', userId: 'user-jordan' },
    { postId: 'post-2', userId: 'user-alex' },
    { postId: 'post-2', userId: 'user-daniel' },
    { postId: 'post-3', userId: 'user-alex' },
    { postId: 'post-3', userId: 'user-sarah' },
    { postId: 'post-3', userId: 'user-emily' },
    { postId: 'post-4', userId: 'user-maya' },
    { postId: 'post-4', userId: 'user-ryan' },
    { postId: 'post-5', userId: 'user-daniel' },
    { postId: 'post-6', userId: 'user-alex' },
    { postId: 'post-6', userId: 'user-sarah' },
    { postId: 'post-7', userId: 'user-jordan' },
    { postId: 'post-8', userId: 'user-emily' },
    { postId: 'post-8', userId: 'user-ryan' },
    { postId: 'post-9', userId: 'user-alex' },
    { postId: 'post-9', userId: 'user-maya' },
    { postId: 'post-10', userId: 'user-sarah' },
    { postId: 'post-11', userId: 'user-emily' },
    { postId: 'post-12', userId: 'user-alex' },
    { postId: 'post-13', userId: 'user-maya' },
    { postId: 'post-14', userId: 'user-sarah' },
    { postId: 'post-15', userId: 'user-sarah' },
    { postId: 'post-15', userId: 'user-maya' },
    { postId: 'post-15', userId: 'user-daniel' },
    { postId: 'post-15', userId: 'user-jordan' },
    { postId: 'post-16', userId: 'user-alex' },
    { postId: 'post-17', userId: 'user-ryan' },
    { postId: 'post-18', userId: 'user-alex' },
    { postId: 'post-19', userId: 'user-emily' },
    { postId: 'post-20', userId: 'user-alex' },
    { postId: 'post-20', userId: 'user-sarah' },
  ];

  for (const l of likesData) {
    await prisma.like.create({
      data: l,
    });
  }
  console.log(`Seeded ${likesData.length} likes.`);

  // 5. Seed Comments
  const commentsData = [
    {
      postId: 'post-1',
      userId: 'user-sarah',
      content: 'Absolutely! Wait until you learn about service routing and ingress configs.',
      createdAt: getPastTime(47),
    },
    {
      postId: 'post-1',
      userId: 'user-jordan',
      content: 'Make sure to get comfortable with yaml. You will be writing a lot of it!',
      createdAt: getPastTime(46),
    },
    {
      postId: 'post-2',
      userId: 'user-alex',
      content: 'Agreed! Indexes on foreign keys make JOIN queries significantly faster.',
      createdAt: getPastTime(44),
    },
    {
      postId: 'post-3',
      userId: 'user-emily',
      content: 'That sounds beautiful. Are you using any specific design templates?',
      createdAt: getPastTime(41),
    },
    {
      postId: 'post-4',
      userId: 'user-ryan',
      content: 'k6 is incredible. The integration with Grafana metrics is excellent.',
      createdAt: getPastTime(37),
    },
    {
      postId: 'post-8',
      userId: 'user-emily',
      content: 'Yes! If you do not configure readiness probes, Kubernetes might route traffic to an uninitialized pod.',
      createdAt: getPastTime(25),
    },
    {
      postId: 'post-9',
      userId: 'user-alex',
      content: 'Fully agree, Sarah. Type safety from endpoints to DB is a game changer.',
      createdAt: getPastTime(23),
    },
    {
      postId: 'post-15',
      userId: 'user-sarah',
      content: 'This sounds like the perfect sandbox for showing off scale and auto-recovery!',
      createdAt: getPastTime(9),
    },
    {
      postId: 'post-15',
      userId: 'user-jordan',
      content: 'Will you release a blog post or documentation on the test outcomes?',
      createdAt: getPastTime(8),
    },
  ];

  for (const c of commentsData) {
    await prisma.comment.create({
      data: c,
    });
  }
  console.log(`Seeded ${commentsData.length} comments.`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
