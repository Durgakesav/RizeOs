import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  VideoCameraIcon,
  ArchiveBoxIcon,
  BellSlashIcon
} from '@heroicons/react/24/outline';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage,
  markAsRead 
} from '../store/slices/messageSlice';
import toast from 'react-hot-toast';

const Messages = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { conversations, messages, loading } = useSelector(state => state.messages);
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversationMenu, setShowConversationMenu] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      await dispatch(fetchConversations());
    } catch (error) {
      toast.error('Failed to load conversations');
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      await dispatch(fetchMessages(conversationId));
      await dispatch(markAsRead(conversationId));
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await dispatch(sendMessage({
        conversationId: selectedConversation._id,
        content: messageText
      }));
      setMessageText('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const getConversationName = (conversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p._id !== user?._id);
      return otherParticipant?.name || 'Unknown User';
    }
    return conversation.title || 'Group Chat';
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p._id !== user?._id);
      return otherParticipant?.profileImage;
    }
    return null;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations?.filter(conv => {
    const name = getConversationName(conv).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex h-[600px]">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                  <button className="text-primary-600 hover:text-primary-700">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?._id === conversation._id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {getConversationAvatar(conversation) ? (
                          <img
                            src={getConversationAvatar(conversation)}
                            alt={getConversationName(conversation)}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="w-10 h-10 text-gray-400" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {getConversationName(conversation)}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage?.content || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations</h3>
                    <p className="text-gray-500">Start a conversation to connect with others</p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Message Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getConversationAvatar(selectedConversation) ? (
                          <img
                            src={getConversationAvatar(selectedConversation)}
                            alt={getConversationName(selectedConversation)}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="w-8 h-8 text-gray-400" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {getConversationName(selectedConversation)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedConversation.participants?.length || 0} participants
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <PhoneIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <VideoCameraIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConversationMenu(!showConversationMenu)}
                        >
                          <EllipsisHorizontalIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-start space-x-3 animate-pulse">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                              <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : messages?.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex items-start space-x-3 ${
                            message.sender._id === user?._id ? 'flex-row-reverse space-x-reverse' : ''
                          }`}
                        >
                          {message.sender._id !== user?._id && (
                            <div className="flex-shrink-0">
                              {message.sender.profileImage ? (
                                <img
                                  src={message.sender.profileImage}
                                  alt={message.sender.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <UserCircleIcon className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                          )}
                          <div className={`flex-1 max-w-xs ${
                            message.sender._id === user?._id ? 'text-right' : ''
                          }`}>
                            <div className={`inline-block p-3 rounded-lg ${
                              message.sender._id === user?._id
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400">Send a message to start the conversation</p>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                          placeholder="Type a message..."
                          rows={1}
                          className="input-field resize-none"
                        />
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PaperAirplaneIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 