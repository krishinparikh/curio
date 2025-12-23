'use server'

import { prisma } from '@/lib/prisma/db';

/**
 * Retrieves all modules for a course
 * Verifies that the user owns the course
 */
export async function getModules(courseId: string, userId: string) {
  // First verify the course belongs to the user
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

  return prisma.module.findMany({
    where: { courseId: courseId },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      overview: true,
      order: true,
      isComplete: true,
      messages: true,
      currentFollowUps: true,
      courseId: true,
    },
  });
}

/**
 * Retrieves a single module by ID with full context
 * Includes course details and all sibling modules for AI prompt context
 * Verifies that the user owns the module's course
 */
export async function getModuleById(moduleId: string, userId: string) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: {
      id: true,
      name: true,
      overview: true,
      content: true,
      order: true,
      isComplete: true,
      messages: true,
      currentFollowUps: true,
      courseId: true,
      course: {
        select: {
          id: true,
          name: true,
          description: true,
          userId: true,
          modules: {
            select: {
              id: true,
              name: true,
              overview: true,
              order: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  // Authorization check: verify user owns the course this module belongs to
  if (module && module.course.userId !== userId) {
    throw new Error('Unauthorized: You do not have access to this module');
  }

  return module;
}

/**
 * Marks a module as complete and updates session progress
 * Verifies that the user owns the module's session
 *
 * Business logic:
 * - Users can mark modules complete even if chat is left halfway
 * - Module completion triggers session progress update
 */
export async function markModuleComplete(moduleId: string, userId: string) {
  // First verify the module belongs to a course owned by the user
  const existingModule = await prisma.module.findUnique({
    where: { id: moduleId },
    select: {
      course: {
        select: { userId: true },
      },
    },
  });

  if (!existingModule) {
    throw new Error('Module not found');
  }

  if (existingModule.course.userId !== userId) {
    throw new Error('Unauthorized: You do not have access to this module');
  }

  const module = await prisma.module.update({
    where: { id: moduleId },
    data: { isComplete: true },
    include: {
      course: {
        include: {
          modules: true,
        },
      },
    },
  });

  // Check if all modules in the course are complete
  const allModulesComplete = module.course.modules.every((m) => m.isComplete);

  // TODO: If needed, add a progress field to Course model
  // and update it here with percentage complete

  return {
    module,
    courseComplete: allModulesComplete,
  };
}

/**
 * Gets the title of a module
 */
export async function getModuleTitle(moduleId: string): Promise<string> {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { name: true },
  });

  if (!module) {
    throw new Error('Module not found');
  }

  return module.name;
}

/**
 * Gets the current follow-up questions for a module
 */
export async function getCurrentFollowUps(moduleId: string) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { currentFollowUps: true },
  });

  return module?.currentFollowUps;
}

/**
 * Adds follow-up questions to a module's currentFollowUps field
 */
export async function addCurrentFollowUps(moduleId: string, followUps: unknown) {
  return prisma.module.update({
    where: { id: moduleId },
    data: { currentFollowUps: followUps as any },
  });
}
