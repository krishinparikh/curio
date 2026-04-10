'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, createFollowUpQuestions } from '@/lib/actions/chatActions';
import { getModuleById, addCurrentFollowUps, getCurrentFollowUps, markModuleComplete } from '@/lib/actions/moduleActions';
import { Message } from '@/lib/ai/types';

interface UseAIChatOptions {
  moduleId: string;
  userId: string;
}

interface UseAIChatReturn {
  messages: Message[];
  streamingMessage: string;
  isStreaming: boolean;
  isGeneratingFollowUps: boolean;
  sendMessage: (content: string, model?: string) => void;
  error: string | null;
}

export function useAIChat({ moduleId, userId }: UseAIChatOptions): UseAIChatReturn {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGeneratingFollowUps, setIsGeneratingFollowUps] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string, model?: string) => {
      if (!content.trim()) {
        setError('Message cannot be empty');
        return;
      }

      // Add user message to local state immediately
      const userMessage: Message = { role: 'user', content: content.trim() };
      setMessages((prev) => [...prev, userMessage]);

      setError(null);
      setStreamingMessage('');
      setIsStreaming(true);

      // Abort any previous request
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleId, message: content.trim(), userId, model }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send message');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let buffer = '';
        let fullResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep the last potentially incomplete line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6);
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.type === 'chunk') {
                fullResponse += data.content;
                setStreamingMessage((prev) => prev + data.content);
              } else if (data.type === 'complete') {
                const assistantMessage: Message = { role: 'assistant', content: data.message };
                setMessages((prev) => [...prev, assistantMessage]);
                setStreamingMessage('');
                setIsStreaming(false);

                // Generate follow-up questions
                setIsGeneratingFollowUps(true);
                queryClient.resetQueries({ queryKey: ['currentFollowUps', moduleId] });

                try {
                  const result = await createFollowUpQuestions(moduleId, userId, 3);
                  if (result?.questions) {
                    await addCurrentFollowUps(moduleId, result.questions);
                    queryClient.invalidateQueries({ queryKey: ['currentFollowUps', moduleId] });
                  }
                } catch (err) {
                  console.error('Failed to generate follow-up questions:', err);
                } finally {
                  setIsGeneratingFollowUps(false);
                }
              } else if (data.type === 'error') {
                setError(data.error);
                setIsStreaming(false);
                setStreamingMessage('');
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsStreaming(false);
        setStreamingMessage('');
      }
    },
    [moduleId, userId, queryClient]
  );

  return {
    messages,
    streamingMessage,
    isStreaming,
    isGeneratingFollowUps,
    sendMessage,
    error,
  };
}

export function useGetMessages(moduleId: string, userId: string) {
  return useQuery({
    queryKey: ['messages', moduleId],
    queryFn: () => getMessages(moduleId, userId),
    enabled: !!moduleId && !!userId,
  });
}

export function useGetModule(moduleId: string, userId: string) {
  return useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getModuleById(moduleId, userId),
    enabled: !!moduleId && !!userId,
  });
}

export function useGetCurrentFollowUps(moduleId: string) {
  return useQuery({
    queryKey: ['currentFollowUps', moduleId],
    queryFn: () => getCurrentFollowUps(moduleId),
    enabled: !!moduleId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useAddFollowUps(moduleId: string) {
  return useMutation({
    mutationFn: (followUps: unknown) => addCurrentFollowUps(moduleId, followUps),
  });
}

export function useMarkModuleComplete(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleId: string) => markModuleComplete(moduleId, userId),
    onSuccess: (data, moduleId) => {
      queryClient.invalidateQueries({ queryKey: ['module', moduleId] });

      if (data.module.courseId) {
        queryClient.invalidateQueries({ queryKey: ['modules', data.module.courseId] });
        queryClient.invalidateQueries({ queryKey: ['course', data.module.courseId] });
      }
    },
  });
}
