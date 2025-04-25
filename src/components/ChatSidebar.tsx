import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Conversation, conversations, currentUser } from '@/data/chatData';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { MessageCircle, Search } from 'lucide-react';

interface ChatSidebarProps {
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation) => void;
}

const ChatSidebar = ({ 
  activeConversation, 
  setActiveConversation 
}: ChatSidebarProps) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participants.find(
      p => p.id !== currentUser.id
    );
    
    if (!otherParticipant) return false;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      otherParticipant.name.toLowerCase().includes(searchLower) ||
      conversation.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <div className="w-full h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Sidebar Header */}
      <div className="p-3 flex items-center justify-between bg-sidebar-primary">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 border-2 border-sidebar-primary-foreground">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="h-full w-full object-cover"
            />
          </Avatar>
          <span className="font-semibold text-sidebar-primary-foreground">
            {currentUser.name}
          </span>
        </div>
        <div>
          <Button variant="ghost" size="icon" className="text-sidebar-primary-foreground hover:bg-sidebar-accent/20">
            <MessageCircle size={20} />
          </Button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-sidebar-foreground/60" />
          </div>
          <Input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 bg-sidebar-accent text-sidebar-foreground placeholder:text-sidebar-foreground/60"
          />
        </div>
      </div>
      
      <Separator className="bg-sidebar-border" />

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        {filteredConversations.map(conversation => {
          const otherParticipant = conversation.participants.find(
            p => p.id !== currentUser.id
          );
          
          const isActive = activeConversation?.id === conversation.id;
          
          if (!otherParticipant) return null;
          
          return (
            <div
              key={conversation.id}
              className={`p-3 flex items-center gap-3 cursor-pointer transition-colors
                ${isActive ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'}`}
              onClick={() => setActiveConversation(conversation)}
            >
              <Avatar className="h-12 w-12">
                <img 
                  src={otherParticipant.avatar} 
                  alt={otherParticipant.name} 
                  className="h-full w-full object-cover"
                />
              </Avatar>
              
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sidebar-foreground">
                    {otherParticipant.name}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70">
                    {conversation.lastMessage?.timestamp}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <p className="text-sm text-sidebar-foreground/70 truncate">
                    {conversation.lastMessage?.content}
                  </p>
                  
                  {conversation.unreadCount > 0 && (
                    <span className="ml-1 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
