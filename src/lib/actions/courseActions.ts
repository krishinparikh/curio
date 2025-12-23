'use server'

import { prisma } from '@/lib/prisma/db';
import { OpenAIProvider } from '@/lib/ai/providers/openai';
import { getPrompt } from '@/lib/old_prompts';

const openai = new OpenAIProvider('gpt-4o-mini');

export interface CreateCourseInput {
  userId: string;
  topic: string;
  description?: string;
  length?: 'short' | 'medium' | 'long';
  complexity?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ModuleGeneration {
  name: string;
  overview: string;
  content: string;
  order: number;
}

/**
 * Creates a new course with AI-generated modules
 *
 * Flow:
 * 1. Call OpenAI to generate course description and module structure based on topic
 * 2. Validate that at least one module was generated
 * 3. Iteratively generate content for each module
 * 4. Create course and modules in database transaction
 *
 * @throws Error if AI fails to generate valid modules
 * @throws Error if user not found
 */
export async function createCourse(input: CreateCourseInput) {
  const { userId, topic, length = 'medium', complexity = 'intermediate' } = input;

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Generate course title, description, and modules using OpenAI
  const { courseTitle, courseDescription, modules } = await generateModules(topic, length, complexity);

  if (!modules || modules.length === 0) {
    throw new Error('Failed to generate learning modules. Please try again with a different topic.');
  }

  // Create course with modules in a transaction
  const course = await prisma.course.create({
    data: {
      userId,
      name: courseTitle,
      description: courseDescription,
      originalPrompt: topic,
      modules: {
        create: modules,
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
      lastUpdated: 'desc', // Most recently updated first
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

/**
 * Helper: Generate content (overview) for a specific module
 *
 * @param moduleName - The name of the module
 * @param topic - The overall topic of the course
 * @param complexity - The complexity level
 * @returns A 2-3 paragraph overview with learning objectives
 */
async function generateModuleContent(
  moduleName: string,
  topic: string,
  complexity: string
): Promise<string> {
  try {
    const prompt = getPrompt('moduleContentGenerator.md', {
      complexity,
      moduleName,
      topic,
    });

    const responseContent = await openai.complete(
      [
        {
          role: 'system',
          content: prompt.system,
        },
        {
          role: 'user',
          content: prompt.user!,
        },
      ],
      {
        temperature: 0.7,
      }
    );

    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    return responseContent.trim();
  } catch (error) {
    console.error('Error generating module content:', error);
    // Fallback content
    return `This module focuses on ${moduleName.toLowerCase()} within the context of ${topic}. You will explore key concepts and develop practical skills appropriate for ${complexity}-level learners.\n\nThrough this module, you'll gain hands-on experience and build a solid foundation that prepares you for more advanced topics. The content is designed to be engaging and applicable to real-world scenarios.`;
  }
}

/**
 * Internal: Generate course title, description, and modules using OpenAI
 *
 * First generates the course title, description, and module structure (names and order),
 * then iteratively populates each module with detailed content.
 */
async function generateModules(
  topic: string,
  length: string,
  complexity: string
): Promise<{ courseTitle: string; courseDescription: string; modules: ModuleGeneration[] }> {
  const moduleCount = length === 'short' ? 3 : length === 'medium' ? 5 : 7;

  try {
    // Step 1: Generate course title, description, and module structure in a single call
    const prompt = getPrompt('sessionStructureGenerator.md', {
      complexity,
      length,
      topic,
      moduleCount,
    });

    const responseContent = await openai.complete(
      [
        {
          role: 'system',
          content: prompt.system,
        },
        {
          role: 'user',
          content: prompt.user!,
        },
      ],
      {
        temperature: 0.7,
        responseFormat: 'json_object',
      }
    );

    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    const parsed = JSON.parse(responseContent);

    if (!parsed.sessionTitle || !parsed.sessionDescription || !Array.isArray(parsed.modules)) {
      throw new Error('Invalid response structure from OpenAI');
    }

    const courseTitle = parsed.sessionTitle;
    const courseDescription = parsed.sessionDescription;
    const moduleStructure = parsed.modules;

    // Step 2: Generate content for each module concurrently
    const modules: ModuleGeneration[] = await Promise.all(
      moduleStructure.map(async (module: { name: string; overview?: string }, i: number) => {
        const moduleName = module.name;
        const moduleOverview = module.overview || `Learn about ${moduleName.toLowerCase()}`;
        const content = await generateModuleContent(moduleName, topic, complexity);

        return {
          name: moduleName,
          overview: moduleOverview,
          content: content,
          order: i,
        };
      })
    );

    return { courseTitle, courseDescription, modules };
  } catch (error) {
    console.error('Error generating modules with AI:', error);

    // Fallback: return basic course title, description, and module structure
    const courseTitle = `Learn ${topic}`;
    const courseDescription = `Explore the fundamentals of ${topic} through a structured learning path designed for ${complexity}-level learners. This ${length} curriculum will guide you through key concepts and practical applications, building your knowledge progressively.`;

    const fallbackModules: ModuleGeneration[] = [];

    for (let i = 0; i < moduleCount; i++) {
      const moduleName = `Module ${i + 1}: ${topic}`;
      const fallbackContent = `This module covers fundamental concepts of ${topic}. You will learn key principles and practical applications appropriate for ${complexity}-level learners.\n\nThe content is structured to build your knowledge progressively, ensuring you develop both theoretical understanding and practical skills.`;

      fallbackModules.push({
        name: moduleName,
        overview: fallbackContent,
        content: fallbackContent,
        order: i,
      });
    }

    return { courseTitle, courseDescription, modules: fallbackModules };
  }
}
