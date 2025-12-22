import api from "@/api/axios";

export interface Conversation {
  id: number;
  doctor_id: number;
  doctor_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_archived: boolean;
  is_favorite: boolean;
  is_online: boolean;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  attachment?: string;
  created_at: string;
  is_read: boolean;
}

export interface StartConversationRequest {
  doctor_id: number;
}

export interface SendMessageRequest {
  body?: string;
  attachment?: File;
}

// List all conversations
export const listConversations = async (): Promise<Conversation[]> => {
  const response = await api.get("/conversations");
  return response.data;
};

// Start a new conversation
export const startConversation = async (
  data: StartConversationRequest
): Promise<Conversation> => {
  const response = await api.post("/conversations/start", data);
  return response.data;
};

// Get conversation messages
export const getConversationMessages = async (
  conversationId: number
): Promise<Message[]> => {
  const response = await api.get(`/conversations/${conversationId}`);
  return response.data;
};

// Send a message
export const sendMessage = async (
  conversationId: number,
  data: SendMessageRequest
): Promise<Message> => {
  const formData = new FormData();
  
  if (data.body) {
    formData.append("body", data.body);
  }
  
  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }

  const response = await api.post(
    `/conversations/${conversationId}/messages`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Mark conversation as read
export const markConversationAsRead = async (
  conversationId: number
): Promise<void> => {
  await api.post(`/conversations/${conversationId}/mark-read`);
};

// Toggle archive status
export const toggleArchiveConversation = async (
  conversationId: number
): Promise<Conversation> => {
  const response = await api.patch(`/conversations/${conversationId}/archive`);
  return response.data;
};

// Toggle favorite status
export const toggleFavoriteConversation = async (
  conversationId: number
): Promise<Conversation> => {
  const response = await api.patch(`/conversations/${conversationId}/favorite`);
  return response.data;
};