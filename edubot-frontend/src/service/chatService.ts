import axios from 'axios';

export interface ChatRequest {
  message: string;
  language: string;
}

export interface ChatResponse {
  reply: string;
}

const API_URL = 'http://localhost:3000/api/chat';

export async function sendMessage(message: string, language: string): Promise<ChatResponse> {
  const response = await axios.post<ChatResponse>(API_URL, { message, language });
  return response.data;
}
