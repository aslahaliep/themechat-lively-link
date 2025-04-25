
import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message, currentUser } from '@/data/chatData';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';

interface ChatAreaProps {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
}

const ChatArea = ({ conversation, onSendMessage }: ChatAreaProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Find the other participant (not the current user)
  const otherParticipant = conversation.participants.find(
    p => p.id !== currentUser.id
  );
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);
  
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Header */}
      <div className="px-4 py-3 flex items-center border-b">
        <Avatar className="h-10 w-10 mr-3">
          <img 
            src={otherParticipant?.avatar} 
            alt={otherParticipant?.name} 
            className="h-full w-full object-cover"
          />
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">
            {otherParticipant?.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {otherParticipant?.status === 'online' ? 'online' : `last seen ${otherParticipant?.lastSeen}`}
          </p>
        </div>
      </div>
      
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-muted/30"
        style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        }}
      >
        {conversation.messages.map((message, index) => {
          // Check if this message should be grouped with previous
          const prevMessage = index > 0 ? conversation.messages[index - 1] : null;
          const isSequential = prevMessage && 
                              prevMessage.senderId === message.senderId && 
                              // Simple time-based grouping (could be more sophisticated)
                              message.timestamp === prevMessage.timestamp;
          
          return (
            <MessageBubble 
              key={message.id} 
              message={message}
              isSequential={isSequential}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </ScrollArea>
      
      {/* Message Input */}
      <form onSubmit={handleSend} className="px-4 py-3 flex items-center gap-2 border-t">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button 
          type="submit" 
          size="icon"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={!newMessage.trim()}
        >
          <SendHorizontal size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatArea;
