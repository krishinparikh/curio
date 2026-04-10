export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Display name → LangChain model ID
export const providers: Record<string, string> = {
    "GPT-4o": "gpt-4o",
    "GPT-4o Mini": "gpt-4o-mini",
    "GPT-4 Turbo": "gpt-4-turbo",
};
