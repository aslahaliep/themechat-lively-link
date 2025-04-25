
import React from 'react';
import { Message, currentUser } from '@/data/chatData';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isSequential: boolean;
}

const MessageBubble = ({ message, isSequential }: MessageBubbleProps) => {
  const isSentByCurrentUser = message.senderId === currentUser.id;
  
  return (
    <div 
      className={cn(
        "flex animate-message-in opacity-0",
        isSentByCurrentUser ? "justify-end" : "justify-start",
        isSequential ? "mt-1" : "mt-4"
      )}
      style={{ animationDelay: '0.1s' }}
    >
      <div 
        className={cn(
          "relative max-w-[85%] px-3 py-2 rounded-lg",
          isSentByCurrentUser 
            ? "bg-chat-sent text-chat-sent-foreground rounded-tr-none" 
            : "bg-chat-received text-chat-received-foreground rounded-tl-none"
        )}
      >
        <p className="break-words">{message.content}</p>
        <div className={cn(
          "text-xs opacity-70 flex items-center mt-1",
          isSentByCurrentUser ? "justify-end" : "justify-start"
        )}>
          {message.timestamp}
          {isSentByCurrentUser && (
            <span className="ml-1">
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && (
                <span className="text-blue-600 dark:text-blue-400">✓✓</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
