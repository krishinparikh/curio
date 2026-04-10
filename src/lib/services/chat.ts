import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma/db';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import { followUpQuestionsPrompt } from '@/lib/prompts';
import { Message } from '@/lib/ai/types';
import { getModuleById } from './module';
import { getUserData } from './user';

/**
 * Interface for a sent message
 */
export interface SendMessageInput {
  moduleId: string;
  content: string;
  role: 'user' | 'assistant';
}

/**
 * Retrieves all chat messages for a module
 * Verifies that the user owns the module's course
 */
export async function getMessages(moduleId: string, userId: string): Promise<Message[]> {
  const moduleData = await prisma.module.findUnique({
    where: { id: moduleId },
    select: {
      messages: true,
      course: {
        select: { userId: true },
      },
    },
  });

  if (!moduleData) {
    throw new Error('Module not found');
  }

  // Authorization check: verify user owns the course this module belongs to
  if (moduleData.course.userId !== userId) {
    throw new Error('Unauthorized: You do not have access to this module');
  }

  // Parse and validate JSONB messages
  const messages = moduleData.messages as unknown as Message[];
  return Array.isArray(messages) ? messages : [];
}


/**
 * Adds a single message to the module's message array
 * Verifies that the user owns the module's course
 */
export async function addMessage(moduleId: string, message: Message, userId: string): Promise<void> {
  'use server'

  const currentMessages = await getMessages(moduleId, userId);

  // Check message limit
  const MAX_MESSAGES_PER_MODULE = 100;
  if (currentMessages.length >= MAX_MESSAGES_PER_MODULE) {
    throw new Error('Message limit reached for this module');
  }

  await prisma.module.update({
    where: { id: moduleId },
    data: {
      messages: [...currentMessages, message] as unknown as Prisma.InputJsonValue,
    },
  });
}

/**
 * Generates follow-up questions based on conversation history and module context
 */
export async function createFollowUpQuestions(
  moduleId: string,
  userId: string,
  numQuestions: number = 3
): Promise<{ questions: string[] }> {
  'use server'
  
  try {
    // Fetch latest messages from database
    const messages = await getMessages(moduleId, userId);

    // Fetch module context for better question generation
    const moduleData = await getModuleById(moduleId, userId);
    if (!moduleData) {
      throw new Error('Module not found');
    }

    // Fetch user data for bio
    const userData = await getUserData(userId);
    const userBio = userData.bio || 'No bio provided';

    // Use last 10 messages for context (or all if fewer than 10)
    const contextMessages = messages.slice(-10);

    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 500,
    });

    const systemPrompt = followUpQuestionsPrompt({
      numQuestions,
      moduleName: moduleData.name,
      moduleOverview: moduleData.overview,
      courseName: moduleData.course.name,
      courseDescription: moduleData.course.description || 'No description',
      userBio,
    });

    const langchainMessages = [
      new SystemMessage(systemPrompt),
      ...contextMessages.map((msg) =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
    ];

    const result = await model.invoke(langchainMessages, {
      response_format: { type: 'json_object' },
    });

    const responseText = typeof result.content === 'string' ? result.content : '';

    // Clean markdown code blocks if present
    let cleaned = responseText.trim();
    const codeBlockMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
    if (codeBlockMatch) {
      cleaned = codeBlockMatch[1].trim();
    }

    const parsedResponse = JSON.parse(cleaned);

    // Validate response structure
    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
      throw new Error('Invalid response format from AI');
    }

    // Ensure we have the requested number of questions
    const questions = parsedResponse.questions.slice(0, numQuestions);

    if (questions.length < numQuestions) {
      throw new Error('AI did not generate enough questions');
    }

    return { questions };

  } catch (error) {
    console.error('Error generating follow-up questions:', error);

    // Fallback to generic questions if AI fails
    const fallbackQuestions = [
      "Can you explain this concept in a different way?",
      "How does this relate to real-world applications?",
      "What are some common misconceptions about this topic?",
      "Can you provide an example to illustrate this?",
      "What should I learn next to build on this knowledge?"
    ];

    return {
      questions: fallbackQuestions.slice(0, numQuestions)
    };
  }
}