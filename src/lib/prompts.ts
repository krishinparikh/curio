import { OnboardingContext } from "@/types/onboarding";
import { LLMCourse, LLMInfoSynthesis } from "@/schemas/llm"; 

export function onboardingSystemPrompt(): string {
  return `You are a world-class personal teacher. A user will request some topic they want to learn; your job is to ask 3-5 clarifying questions to inform how to create the best possible course for them. For each question, come up with 2-4 short multiple choice options. The questions should be focused and easy to answer.

  The only required questions should be about:
  1. The learner's goals for the course.
  2. Current expertise level / experience.

  The rest of the questions should aim to clarify their request, only if needed. Do not ask any questions about desired length/duration of the course.

  If the prompt already answers any of these questions, do NOT ask it again.`;
}

export function onboardingUserPrompt(originalPrompt: string): string {
  return `The user (learner) has requested the following:

  """
  ${originalPrompt}
  """`;
}

export function infoSynthesisSystemPrompt(): string {
  return `You will receive a prompt from a user about a topic they want to learn, along with their responses to some clarifying questions. Your task is to extract and structure that information into:
  
  - Topic (1-3 sentences)
  - Goal (1-3 sentences)
  - Current level of skill/experience (each fact gets an entry)
  - Additional context (anything else relevant)`;
}

export function infoSynthesisUserPrompt(onboardingContext: OnboardingContext): string {
  const hasResponses = Object.keys(onboardingContext.responses).length > 0;

  let prompt = `Below is the learner's original prompt:\n\n"""\n${onboardingContext.originalPrompt}\n"""\n`;

  if (hasResponses) {
    prompt += `\nThe learner's responses to questions:\n`;
    
    Object.entries(onboardingContext.responses).forEach(([question, answer]) => {
      prompt += `\nQ: ${question}\nA: ${answer}\n`;
    })
  }

  prompt += `\nCreate a comprehensive course from this.`;

  return prompt;
}

export function courseGenerationSystemPrompt(): string {
  return `You are an expert curriculum designer and educator who is building a personalized course for a user. You will be given the user's desired topic, learning goals, current level of skill/experience, and additional relevant context.   
  
  You will follow this step-by-step thought process:

  1. Identify the gap
  - Where is the user now? (starting point)
  - Where do they want to be? (learning goal)
  - What's missing between these two points?

  2. Map the progression
  - What are all the milestones needed to bridge this gap?
  - List them in order from start to finish
  - Each milestone should build on the previous one

  3. Organize into modules and topics
  - Group related milestones into 3-6 modules (major phases of learning)
  - Within each module, shape milestones into 2-4 topics
  - Modules should be focused and have a clear objective
  - Topics should flow logically and feel cohesive

  4. Finalize the structure
  - Write a descriptive title for each module
  - Write a 1-sentence overview for each module
  - Write a clear, engaging course name (3-8 words) and description (2-3 sentences) that aligns with what you've created
  - The overviews should not include words/phrases like "this module" or "learners"`;
}

export function courseGenerationUserPrompt(infoSynthesis: LLMInfoSynthesis): string {
  let prompt = `Below describes the learner and their request:\n\nTopic: ${infoSynthesis.topic}\n`;

  prompt += `\nGoal: ${infoSynthesis.goal}\n`;

  if (infoSynthesis.currentLevel.length > 0) {
    prompt += `\nCurrent Level:\n${infoSynthesis.currentLevel.map(fact => `- ${fact}`).join('\n')}\n`;
  }

  if (infoSynthesis.additionalConext.length > 0) {
    prompt += `\nAdditional Context:\n${infoSynthesis.additionalConext.map(context => `- ${context}`).join('\n')}\n`;
  }

  prompt += `Follow your instructions to create a personalized course structure.`

  return prompt;
}


export function moduleGenerationSystemPrompt(): string {
  return `You are a world-class educator amazing at simplifying complex concepts into easy-to-understand concepts. Your task is to create comprehensive educational content for a module in a course. You will be given the other course modules and their respective topics; ensure nothing is repeated. 
  
  Follow this exact format:
  ## Overview
  [One brief paragraph]
  ## Name of Topic 1
  [Teach topic 1]
  ## Name of Topic 2
  [Teach topic 2]
  ...
  ## Key Takeaways
  [- Bullet points]
  
  Be extremely succinct and clear. Use practical real-world examples. Use analogies if opportune, but don't force it. Avoid difficult phrases/words.

  Return only the educational content in the format above.`;
}

export function moduleGenerationUserPrompt(course: LLMCourse, index: number): string {
  const currentModule = course.modules[index];

  return `Write comprehensive educational content for this module:

  Module: ${currentModule.name}
  Overview: ${currentModule.overview}
  Topics:
  ${currentModule.topics.map(topic => `- ${topic}`).join('\n  ')}

  For context, this module falls within this course:
  ${course.name}: ${course.description}

  The other modules include:
  ${course.modules.map((m, i) => `${i + 1}. ${m.name}: ${m.overview}\n   Topics: ${m.topics.join(', ')}`).join('\n ')}`;
}
