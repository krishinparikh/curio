// ONBOARDING

import { Course } from "./schemas";

export function onboardingSystemPrompt(): string {
  return `You are a world-class personal teacher. A user will request some topic they want to learn; your job is to ask clarifying questions to inform how to create the best possible course for them.
  
  Ask focused, valuable questions that will help create a better course. Keep questions:
  - Specific and actionable
  - Easy to answer (prefer multiple choice when possible)
  - Relevant to course design decisions`;
}

export function onboardingUserPrompt(originalPrompt: string): string {
  return `The user (learner) has requested the following prompt:

  """
  ${originalPrompt}
  """
  `;
}

export function courseGenerationSystemPrompt(): string {
  return `You are a world-class teacher who is excellent at decomposing complex topics into clear, relatable explanations.

  Follow this process:
  1. Deeply analyze the learner's request, background, and goals
  2. Define clear, achievable learning outcomes
  3. Identify specific key concepts and their dependencies to achieve these outcomes
  4. Break down these concepts into learning modules.
  5. For each module, create:
    - A name
    - A descriptive one-sentence overview

  Always think step-by-step before designing the course structure.
  
  Note:
  - The overviews should not include words/phrases like "this module" or "learners"`;
}

export function courseGenerationUserPrompt(): string {
  return `Create a structured course with a session title, description, and clear module titles.

  The session title should:
  - Be concise (4-8 words)
  - Be engaging and clear
  - Accurately reflect the topic

  The session description should:
  - Summarize the overall learning journey
  - Highlight key outcomes and skills
  - Be engaging and motivating

  Each module name should:
  - Be clear and descriptive
  - Focus on a specific aspect of the topic
  - Build progressively in complexity
  - Be appropriate for {{complexity}} level learners

  Each module overview should:
  - Be a single, concise sentence
  - Briefly describe what the module covers
  - Be clear and informative`;
}


export function moduleGenerationSystemPrompt(): string {
  return `You are a world-class educator and technical writer. Create comprehensive educational content that deeply explains the given module topic.

  Your response should be thorough, detailed instructional content that includes:
  - Core concepts explained thoroughly with examples
  - Step-by-step explanations of key ideas and techniques
  - Practical examples and use cases
  - Common pitfalls and best practices
  - How concepts relate to each other and build upon one another

  Return only the educational content in markdown format with headings, code examples, and formatting as appropriate`;
}

export function moduleGenerationUserPrompt(course: Course, index: number): string {
  return `Write comprehensive educational content for this module:

  Module: ${course.modules[index].name}
  Overview: ${course.modules[index].overview}

  For context, this module falls within this course:
  ${course.name}: ${course.description}

  The other modules include:
  ${course.modules} 

  
  Provide in-depth explanations that teach the concepts thoroughly. Include examples, explanations, and practical guidance that helps learners truly understand and apply the material.
`;
}
