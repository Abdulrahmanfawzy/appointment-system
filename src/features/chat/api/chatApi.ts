import api from "@/api/axios";

export interface Conversation {
  id: number;
  doctor_name: string;
  doctor_avatar?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_online: boolean;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  created_at: string;
  is_read: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface SendMessagePayload {
  body: string;
}

// Get all conversations
export const listConversations = async (): Promise<Conversation[]> => {
  const response = await api.get("/conversations");
  return response.data;
};

// Get messages for a specific conversation
export const getConversationMessages = async (
  conversationId: number
): Promise<Message[]> => {
  const response = await api.get(`/conversations/${conversationId}/messages`);
  return response.data;
};

// Send a new message
export const sendMessage = async (
  conversationId: number,
  payload: SendMessagePayload
): Promise<Message> => {
  const response = await api.post(
    `/conversations/${conversationId}/messages`,
    payload
  );
  return response.data;
};

// Mark conversation as read
export const markConversationAsRead = async (
  conversationId: number
): Promise<void> => {
  await api.patch(`/conversations/${conversationId}/read`);
};

// Mark message as read
export const markMessageAsRead = async (
  conversationId: number,
  messageId: number
): Promise<void> => {
  await api.patch(
    `/conversations/${conversationId}/messages/${messageId}/read`
  );
};
