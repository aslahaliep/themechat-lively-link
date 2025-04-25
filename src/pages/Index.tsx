import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ChatSidebar from '@/components/ChatSidebar';
import ChatArea from '@/components/ChatArea';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Conversation, Message, conversations as initialConversations } from '@/data/chatData';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(
    conversations[0] || null
  );
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  
  const handleSendMessage = (content: string) => {
    if (!activeConversation) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      senderId: 'user1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    const updatedActiveConversation = updatedConversations.find(
      conv => conv.id === activeConversation.id
    );
    
    if (updatedActiveConversation) {
      setActiveConversation(updatedActiveConversation);
    }
    
    setTimeout(() => {
      const deliveredConversations = updatedConversations.map(conv => {
        if (conv.id === activeConversation.id) {
          const updatedMessages = conv.messages.map(msg => {
            if (msg.id === newMessage.id) {
              return { ...msg, status: 'delivered' as const };
            }
            return msg;
          });
          
          return {
            ...conv,
            messages: updatedMessages,
            lastMessage: { ...newMessage, status: 'delivered' as const }
          };
        }
        return conv;
      });
      
      setConversations(deliveredConversations);
      
      const deliveredActiveConversation = deliveredConversations.find(
        conv => conv.id === activeConversation.id
      );
      
      if (deliveredActiveConversation) {
        setActiveConversation(deliveredActiveConversation);
      }
    }, 1000);
    
    setTimeout(() => {
      const readConversations = conversations.map(conv => {
        if (conv.id === activeConversation.id) {
          const readMessages = conv.messages.map(msg => {
            if (msg.senderId === 'user1') {
              return { ...msg, status: 'read' as const };
            }
            return msg;
          });
          
          const lastMsg = conv.lastMessage && conv.lastMessage.senderId === 'user1'
            ? { ...conv.lastMessage, status: 'read' as const }
            : conv.lastMessage;
          
          return {
            ...conv,
            messages: readMessages,
            lastMessage: lastMsg
          };
        }
        return conv;
      });
      
      setConversations(readConversations);
      
      const readActiveConversation = readConversations.find(
        conv => conv.id === activeConversation.id
      );
      
      if (readActiveConversation) {
        setActiveConversation(readActiveConversation);
      }
    }, 2500);
    
    if (activeConversation.id === 'conv1') {
      setTimeout(() => {
        const contact = activeConversation.participants.find(p => p.id !== 'user1');
        
        if (!contact) return;
        
        const replyMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          content: "Thanks for the update! Looking forward to seeing it.",
          senderId: contact.id,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };
        
        const repliedConversations = conversations.map(conv => {
          if (conv.id === activeConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, replyMessage],
              lastMessage: replyMessage,
              unreadCount: activeConversation.id === conv.id ? 0 : conv.unreadCount + 1
            };
          }
          return conv;
        });
        
        setConversations(repliedConversations);
        
        const repliedActiveConversation = repliedConversations.find(
          conv => conv.id === activeConversation.id
        );
        
        if (repliedActiveConversation) {
          setActiveConversation(repliedActiveConversation);
          
          toast({
            title: contact.name,
            description: replyMessage.content,
          });
        }
      }, 5000);
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  const handleSelectConversation = (conversation: Conversation) => {
    const updatedConversation = {
      ...conversation,
      unreadCount: 0
    };
    
    setActiveConversation(updatedConversation);
    
    setConversations(
      conversations.map(conv => 
        conv.id === conversation.id 
          ? updatedConversation 
          : conv
      )
    );
    
    if (isMobile) {
      setShowSidebar(false);
    }
  };
  
  return (
    <div className="h-screen flex flex-col bg-background">
      {isMobile && (
        <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            {showSidebar ? 'WhatsApp Chat' : activeConversation?.participants.find(p => p.id !== 'user1')?.name}
          </h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="text-primary-foreground"
          >
            {showSidebar ? 'Chat' : 'Contacts'}
          </Button>
        </div>
      )}
      
      <div className="flex-1 flex overflow-hidden">
        {(showSidebar || !isMobile) && (
          <div className={`${isMobile ? 'w-full' : 'w-80'} flex-shrink-0 h-full`}>
            <ChatSidebar 
              activeConversation={activeConversation}
              setActiveConversation={handleSelectConversation}
            />
          </div>
        )}
        
        {(!showSidebar || !isMobile) && activeConversation && (
          <div className="flex-1 h-full">
            <ChatArea 
              conversation={activeConversation}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}
        
        {(!showSidebar || !isMobile) && !activeConversation && (
          <div className="flex-1 flex items-center justify-center p-6 bg-muted/30">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to WhatsApp</h2>
              <p className="text-muted-foreground mb-6">Select a conversation to start chatting</p>
              {isMobile && (
                <Button onClick={toggleSidebar}>View Contacts</Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <ThemeSwitcher />
    </div>
  );
};

export default Index;
