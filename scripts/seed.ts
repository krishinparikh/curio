/**
 * Database Seed Script
 *
 * Populates the database with sample data for testing services
 * Run with: npm run seed
 */

import { prisma } from '@/lib/prisma/db';

async function main() {
  console.log('Starting database seed...\n');

  // Clean existing data (optional - comment out if you want to keep existing data)
  console.log('Cleaning existing data...');
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleaned existing data\n');

  // Create test users
  console.log('Creating users...');
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      bio: 'Software engineer passionate about learning new technologies',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      bio: 'Data scientist exploring AI and machine learning',
    },
  });

  console.log(`Created user: ${user1.name} (ID: ${user1.id})`);
  console.log(`Created user: ${user2.name} (ID: ${user2.id})\n`);

  // Create courses
  console.log('Creating courses...');
  const course1 = await prisma.course.create({
    data: {
      userId: user1.id,
      name: 'Introduction to TypeScript',
      description: 'Learn the fundamentals of TypeScript for modern web development',
      originalPrompt: 'I want to learn TypeScript basics',
      modules: {
        create: [
          {
            name: 'TypeScript Basics',
            overview: 'Introduction to TypeScript syntax, types, and basic concepts. Learn about primitive types, type inference, and type annotations.',
            order: 0,
            isComplete: false,
            messages: [],
          },
          {
            name: 'Advanced Types',
            overview: 'Explore union types, intersection types, generics, and utility types. Understand how to create flexible and reusable type definitions.',
            order: 1,
            isComplete: false,
            messages: [],
          },
          {
            name: 'TypeScript with React',
            overview: 'Apply TypeScript to React applications. Learn how to type components, props, state, and hooks effectively.',
            order: 2,
            isComplete: false,
            messages: [],
          },
        ],
      },
    },
    include: {
      modules: true,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      userId: user1.id,
      name: 'Machine Learning Fundamentals',
      description: 'Understanding core concepts in machine learning and AI',
      originalPrompt: 'Teach me machine learning',
      modules: {
        create: [
          {
            name: 'What is Machine Learning?',
            overview: 'Introduction to ML concepts, types of learning (supervised, unsupervised, reinforcement), and real-world applications.',
            order: 0,
            isComplete: true,
            messages: [],
          },
          {
            name: 'Linear Regression',
            overview: 'Learn the fundamentals of linear regression, cost functions, and gradient descent optimization.',
            order: 1,
            isComplete: false,
            messages: [],
          },
        ],
      },
    },
    include: {
      modules: true,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      userId: user2.id,
      name: 'Web Development with Next.js',
      description: 'Master modern web development using Next.js and React',
      originalPrompt: 'Next.js tutorial',
      modules: {
        create: [
          {
            name: 'Next.js Fundamentals',
            overview: 'Learn about file-based routing, server components, and the App Router architecture.',
            order: 0,
            isComplete: false,
            messages: [],
          },
        ],
      },
    },
    include: {
      modules: true,
    },
  });

  console.log(`Created course: ${course1.name} (ID: ${course1.id})`);
  console.log(`   - Modules: ${course1.modules.length}`);
  console.log(`Created course: ${course2.name} (ID: ${course2.id})`);
  console.log(`   - Modules: ${course2.modules.length}`);
  console.log(`Created course: ${course3.name} (ID: ${course3.id})`);
  console.log(`   - Modules: ${course3.modules.length}\n`);

  // Create chat messages for one of the modules
  console.log('Creating chat messages...');
  const firstModule = course1.modules[0];

  await prisma.module.update({
    where: { id: firstModule.id },
    data: {
      messages: [
        {
          role: 'user',
          content: 'Hi! Can you explain what TypeScript is?',
        },
        {
          role: 'assistant',
          content: 'Hello! TypeScript is a superset of JavaScript that adds static typing to the language. It helps catch errors during development and makes your code more maintainable. Think of it as JavaScript with extra features that help you write safer code!',
        },
        {
          role: 'user',
          content: 'What are the main benefits of using TypeScript?',
        },
        {
          role: 'assistant',
          content: 'Great question! The main benefits are:\n\n1. **Type Safety**: Catch errors before runtime\n2. **Better IDE Support**: Get autocomplete and inline documentation\n3. **Improved Refactoring**: Confidently rename variables and functions\n4. **Self-Documenting Code**: Types serve as inline documentation\n5. **Enhanced Collaboration**: Teams can understand code interfaces easily',
        },
      ],
    },
  });

  console.log(`Created 4 chat messages for module: ${firstModule.name}\n`);

  // Summary
  console.log('Seed Summary:');
  console.log('================');
  console.log(`Users created: 2`);
  console.log(`Courses created: 3`);
  console.log(`Modules created: ${course1.modules.length + course2.modules.length + course3.modules.length}`);
  console.log(`Chat messages created: 4\n`);

  console.log('Test Data IDs (use these in your test scripts):');
  console.log('==================================================');
  console.log(`User 1 ID: ${user1.id}`);
  console.log(`User 2 ID: ${user2.id}`);
  console.log(`Course 1 ID: ${course1.id}`);
  console.log(`Course 2 ID: ${course2.id}`);
  console.log(`Course 3 ID: ${course3.id}`);
  console.log(`Module 1 ID: ${firstModule.id}`);
  console.log('\nSeed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
