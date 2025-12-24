import { Search, MoreVertical, Send, Paperclip, Check, CheckCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listConversations,
  getConversationMessages,
  sendMessage,
  markConversationAsRead,
  type Message,
} from "@/features/chat/api/chatApi";

function Chat() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ["messages", selectedChat],
    queryFn: () => getConversationMessages(selectedChat!),
    enabled: selectedChat !== null,
    refetchInterval: 3000, // Refresh every 3 seconds when chat is open
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { conversationId: number; body: string }) =>
      sendMessage(data.conversationId, { body: data.body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedChat] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setMessageText("");
      scrollToBottom();
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      // You can add toast notification here
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

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator (you can connect this to a real WebSocket)
  useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout>;
    
    if (messageText) {
      setIsTyping(true);
      typingTimeout = setTimeout(() => setIsTyping(false), 1000);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [messageText]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current user ID from localStorage or auth context
  const currentUserId = parseInt(localStorage.getItem("user_id") || "0");

  // Render message status icon
  const renderMessageStatus = (message: Message) => {
    if (message.sender_id === currentUserId) {
      if (message.is_read) {
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      }
      return <Check className="w-4 h-4 text-gray-400" />;
    }
    return null;
  };

  return (
    <>
      <hr className="mt-2" />
      <div className="flex h-[calc(100vh-64px)] bg-white">
        {/* Left Sidebar - Chat List */}
        <div className="w-[280px] border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
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
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100",
                    selectedChat === conversation.id && "bg-blue-50 border-l-4 border-l-blue-600"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {conversation.doctor_avatar ? (
                      <img
                        src={conversation.doctor_avatar}
                        alt={conversation.doctor_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                        {conversation.doctor_name.charAt(0).toUpperCase()}
                      </div>
                    )}
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
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {conversation.last_message_time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate flex-1">
                        {conversation.last_message}
                      </p>
                      {conversation.unread_count > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
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
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {conversations.find((c) => c.id === selectedChat)?.doctor_avatar ? (
                      <img
                        src={conversations.find((c) => c.id === selectedChat)?.doctor_avatar}
                        alt="Doctor"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {conversations.find((c) => c.id === selectedChat)?.doctor_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {conversations.find((c) => c.id === selectedChat)?.doctor_name}
                      </h2>
                      {conversations.find((c) => c.id === selectedChat)?.is_online && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      Loading messages...
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <p className="text-lg mb-2">No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender_id === currentUserId;
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            isOwnMessage ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl p-3 shadow-sm",
                              isOwnMessage
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white text-gray-900 rounded-bl-none"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.body}
                            </p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span
                                className={cn(
                                  "text-xs",
                                  isOwnMessage ? "text-blue-100" : "text-gray-500"
                                )}
                              >
                                {new Date(message.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {renderMessageStatus(message)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-sm">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                    className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className={cn(
                      "bg-blue-600 hover:bg-blue-700 transition-all",
                      sendMessageMutation.isPending && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {sendMessageMutation.isPending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                {sendMessageMutation.isError && (
                  <p className="text-xs text-red-500 mt-2">
                    Failed to send message. Please try again.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Start your chat
                </h2>
                <p className="text-gray-600">
                  Stay in touch with your doctor for easier follow-up and better care
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;