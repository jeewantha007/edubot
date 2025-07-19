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

export async function saveMessageToHistory(sessionId: string, userId: string | null, message: { text: string, role: 'user' | 'bot', timestamp: Date }) {
  const response = await fetch(`${API_URL}/api/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, userId, message }),
  });
  return await response.json();
}

export async function fetchChatHistory(sessionId: string) {
  const response = await fetch(`${API_URL}/api/history?sessionId=${encodeURIComponent(sessionId)}`);
  return await response.json();
}

export async function fetchAllSessions(userId: string | null = null) {
  let url = `${API_URL}/api/history`;
  if (userId) url += `?userId=${encodeURIComponent(userId)}`;
  const response = await fetch(url);
  return await response.json();
}

export async function deleteChatSession(id: string) {
  const response = await fetch(`${API_URL}/api/history/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
}
