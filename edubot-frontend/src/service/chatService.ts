import axios from 'axios';

export interface ChatRequest {
  message: string;
  language: string;
}

export interface ChatResponse {
  reply: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function sendMessage(message: string, language: string, sessionId: string) {
  if (!sessionId) throw new Error('sessionId is required');
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      language,
      sessionId,
    }),
  });
  return await response.json();
}
