import { Search, MoreVertical, Send, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listConversations,
  getConversationMessages,
  sendMessage,
  markConversationAsRead,
} from "@/features/chat/api/chatApi";

function Chat() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ["messages", selectedChat],
    queryFn: () => getConversationMessages(selectedChat!),
    enabled: selectedChat !== null,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { conversationId: number; body: string }) =>
      sendMessage(data.conversationId, { body: data.body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedChat] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setMessageText("");
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markConversationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Handle chat selection
  const handleSelectChat = (conversationId: number) => {
    setSelectedChat(conversationId);
    markAsReadMutation.mutate(conversationId);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    sendMessageMutation.mutate({
      conversationId: selectedChat,
      body: messageText,
    });
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Chat List */}
      <div className="w-[280px] border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for chat, doctor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectChat(conversation.id)}
                className={cn(
                  "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                  selectedChat === conversation.id && "bg-blue-50"
                )}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                    {conversation.doctor_name.charAt(0)}
                  </div>
                  {conversation.is_online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {conversation.doctor_name}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {conversation.last_message_time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate flex-1">
                      {conversation.last_message}
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Content - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {conversations.find((c) => c.id === selectedChat)?.doctor_name}
              </h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loadingMessages ? (
                <div className="text-center text-gray-500">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.sender_id === selectedChat
                          ? "justify-start"
                          : "justify-end"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          message.sender_id === selectedChat
                            ? "bg-white text-gray-900"
                            : "bg-blue-600 text-white"
                        )}
                      >
                        <p className="text-sm">{message.body}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[44px] max-h-[120px] resize-none"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Start your chat
              </h2>
              <p className="text-gray-600">
                Stay in touch with your doctor for easier follow-up
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;