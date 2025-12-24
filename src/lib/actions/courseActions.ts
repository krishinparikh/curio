'use server'

import { prisma } from '@/lib/prisma/db';
import { CourseGenerationAgent } from '@/lib/course_generation/courseGenerationAgent';
import { ModuleGenerationAgent } from '@/lib/course_generation/moduleGenerationAgent';
import { OnboardingContext } from '@/lib/schemas';

/**
 * Creates a new course with AI-generated modules
 *
 * Flow:
 * 1. Verify user exists
 * 2. Build OnboardingContext from originalPrompt
 * 3. Use CourseGenerationAgent to generate course structure
 * 4. Use ModuleGenerationAgent to generate content for each module concurrently
 * 5. Save course and modules to database in transaction
 *
 * @throws Error if user not found
 */
export async function createCourse(userId: string, originalPrompt: string) {
  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Build onboarding context
  const context: OnboardingContext = { originalPrompt };

  // Generate course structure using CourseGenerationAgent
  const courseAgent = new CourseGenerationAgent();
  const courseStructure = await courseAgent.generateCourse(context);

  // Generate all module content concurrently using ModuleGenerationAgent
  const moduleAgent = new ModuleGenerationAgent();
  const modulesWithContent = await Promise.all(
    courseStructure.modules.map(async (module, index) => ({
      name: module.name,
      overview: module.overview,
      content: await moduleAgent.generateModuleContent(courseStructure, index),
      order: module.order,
    }))
  );

  // Create course with modules in a transaction
  const course = await prisma.course.create({
    data: {
      userId,
      name: courseStructure.name,
      description: courseStructure.description,
      originalPrompt,
      modules: {
        create: modulesWithContent,
      },
    },
    include: {
      modules: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return course;
}

/**
 * Retrieves all courses for a user
 */
export async function getCourses(userId: string) {
  return prisma.course.findMany({
    where: { userId },
    include: {
      modules: {
        select: {
          id: true,
          isComplete: true,
        },
      },
    },
    orderBy: {
      lastActive: 'desc', // Most recently updated first
    },
  });
}

/**
 * Retrieves a single course by ID
 * Verifies that the user owns the course
 */
export async function getCourseById(courseId: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
      },
    },
  });

  // Authorization check: verify user owns this course
  if (course && course.userId !== userId) {
    throw new Error('Unauthorized: You do not have access to this course');
  }

  return course;
}

/**
 * Deletes a course and its associated modules
 * Verifies that the user owns the course before deletion
 */
export async function deleteCourse(courseId: string, userId: string) {
  // Verify course exists and user owns it
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { userId: true },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.userId !== userId) {
    throw new Error('Unauthorized: You do not have access to this course');
  }

  // Delete course (modules will be cascade deleted due to foreign key relationship)
  await prisma.course.delete({
    where: { id: courseId },
  });
}
