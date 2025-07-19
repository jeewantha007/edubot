import axios from 'axios';

export interface ChatRequest {
  message: string;
  language: string;
}

export interface ChatResponse {
  reply: string;
}

const API_URL = 'http://localhost:3000/api/chat';

export async function sendMessage(message: string, language: string, sessionId: string) {
  if (!sessionId) throw new Error('sessionId is required');
  const response = await axios.post(API_URL, {
    message,
    language,
    sessionId,
  });
  return response.data;
}
