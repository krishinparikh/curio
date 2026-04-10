import { NextRequest } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { auth } from '@/lib/auth';
import { addMessage, getMessages } from '@/lib/actions/chatActions';
import { getModuleById } from '@/lib/actions/moduleActions';
import { getUserData } from '@/lib/actions/userActions';
import { tutorSystemPrompt } from '@/lib/prompts';
import { Message } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { moduleId, message, userId, model } = await request.json();

    // Validate that the authenticated user matches the requested userId
    if (session.user.id !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!moduleId || !message?.trim() || !userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid moduleId, message, or userId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Save user message to database
    const userMessage: Message = { role: 'user', content: message.trim() };
    await addMessage(moduleId, userMessage, userId);

    // Get conversation history and module context
    const [conversationHistory, moduleContext, userData] = await Promise.all([
      getMessages(moduleId, userId),
      getModuleById(moduleId, userId),
      getUserData(userId),
    ]);

    if (!moduleContext) {
      return new Response(
        JSON.stringify({ error: 'Module not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userName = userData.name || 'Student';
    const userBio = userData.bio || 'No bio provided yet.';

    const allModulesFormatted = moduleContext.course.modules
      .map((mod) => `${mod.order}. **${mod.name}**: ${mod.overview}`)
      .join('\n');

    const systemPromptContent = tutorSystemPrompt({
      moduleName: moduleContext.name,
      courseName: moduleContext.course.name,
      courseDescription: moduleContext.course.description,
      allModules: allModulesFormatted,
      moduleOrder: String(moduleContext.order),
      moduleOverview: moduleContext.overview,
      moduleContent: moduleContext.content,
      userName,
      userBio,
    });

    // Build LangChain messages
    const langchainMessages = [
      new SystemMessage(systemPromptContent),
      ...conversationHistory.map((msg) =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
    ];

    // Create ChatOpenAI instance
    const chatModel = new ChatOpenAI({
      modelName: model || 'gpt-4o-mini',
      temperature: 0.7,
      streaming: true,
    });

    // Stream response via SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullResponse = '';

        try {
          const responseStream = await chatModel.stream(langchainMessages);

          for await (const chunk of responseStream) {
            const content = typeof chunk.content === 'string' ? chunk.content : '';
            if (content) {
              fullResponse += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`)
              );
            }
          }

          // Save complete assistant message to DB
          const assistantMessage: Message = { role: 'assistant', content: fullResponse };
          await addMessage(moduleId, assistantMessage, userId);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'complete', message: fullResponse, moduleId })}\n\n`
            )
          );
        } catch (error) {
          console.error('AI chat streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
