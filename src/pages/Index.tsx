
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ChatSidebar from '@/components/ChatSidebar';
import ChatArea from '@/components/ChatArea';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Conversation, Message, conversations as initialConversations } from '@/data/chatData';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

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
    
    // Create a new message
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      senderId: 'user1', // Current user
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    // Update the conversation with the new message
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
    
    // Update the active conversation
    const updatedActiveConversation = updatedConversations.find(
      conv => conv.id === activeConversation.id
    );
    
    if (updatedActiveConversation) {
      setActiveConversation(updatedActiveConversation);
    }
    
    // Simulate message delivery after a delay
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
      
      // Update the active conversation
      const deliveredActiveConversation = deliveredConversations.find(
        conv => conv.id === activeConversation.id
      );
      
      if (deliveredActiveConversation) {
        setActiveConversation(deliveredActiveConversation);
      }
    }, 1000);
    
    // Simulate read receipt after another delay
    setTimeout(() => {
      const readConversations = conversations.map(conv => {
        if (conv.id === activeConversation.id) {
          const readMessages = conv.messages.map(msg => {
            if (msg.senderId === 'user1') { // Current user's messages
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
      
      // Update active conversation
      const readActiveConversation = readConversations.find(
        conv => conv.id === activeConversation.id
      );
      
      if (readActiveConversation) {
        setActiveConversation(readActiveConversation);
      }
    }, 2500);
    
    // Simulate reply after a delay for the first conversation only (demo)
    if (activeConversation.id === 'conv1') {
      setTimeout(() => {
        // Find the contact for this conversation
        const contact = activeConversation.participants.find(p => p.id !== 'user1');
        
        if (!contact) return;
        
        // Create a reply message
        const replyMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          content: "Thanks for the update! Looking forward to seeing it.",
          senderId: contact.id,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };
        
        // Update conversations with the reply
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
        
        // Update active conversation
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
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  // Handler for selecting a conversation
  const handleSelectConversation = (conversation: Conversation) => {
    // Mark all messages as read
    const updatedConversation = {
      ...conversation,
      unreadCount: 0
    };
    
    setActiveConversation(updatedConversation);
    
    // Update conversations
    setConversations(
      conversations.map(conv => 
        conv.id === conversation.id 
          ? updatedConversation 
          : conv
      )
    );
    
    // On mobile, hide sidebar after selecting a conversation
    if (isMobile) {
      setShowSidebar(false);
    }
  };
  
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile Header with Menu Toggle */}
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
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - conditionally shown on mobile */}
        {(showSidebar || !isMobile) && (
          <div className={`${isMobile ? 'w-full' : 'w-80'} flex-shrink-0 h-full`}>
            <ChatSidebar 
              activeConversation={activeConversation}
              setActiveConversation={handleSelectConversation}
            />
          </div>
        )}
        
        {/* Chat Area - conditionally shown on mobile */}
        {(!showSidebar || !isMobile) && activeConversation && (
          <div className="flex-1 h-full">
            <ChatArea 
              conversation={activeConversation}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}
        
        {/* Empty State */}
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
      
      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
};

export default Index;
