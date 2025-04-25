
export interface User {
  id: string;
  name: string;
  avatar: string;
  status?: string;
  lastSeen?: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
}

// Sample users
export const currentUser: User = {
  id: 'user1',
  name: 'You',
  avatar: 'https://ui-avatars.com/api/?name=You&background=25D366&color=fff',
  status: 'online'
};

export const contacts: User[] = [
  {
    id: 'user2',
    name: 'Sarah Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=5E35B1&color=fff',
    status: 'online',
    lastSeen: 'online'
  },
  {
    id: 'user3',
    name: 'Mike Chen',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=1E88E5&color=fff',
    lastSeen: '5 minutes ago'
  },
  {
    id: 'user4',
    name: 'Alex Morgan',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Morgan&background=D81B60&color=fff',
    lastSeen: '2 hours ago'
  },
  {
    id: 'user5',
    name: 'Carlos Rodriguez',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=43A047&color=fff',
    status: 'online',
    lastSeen: 'online'
  },
  {
    id: 'user6',
    name: 'Emma Wilson',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=FB8C00&color=fff',
    lastSeen: 'yesterday'
  }
];

// Sample conversations
export const conversations: Conversation[] = [
  {
    id: 'conv1',
    participants: [currentUser, contacts[0]],
    messages: [
      {
        id: 'msg1',
        content: 'Hey, how are you doing?',
        timestamp: '10:30 AM',
        senderId: 'user2',
        status: 'read'
      },
      {
        id: 'msg2',
        content: 'I\'m good, thanks! Just finished the project we were working on.',
        timestamp: '10:32 AM',
        senderId: 'user1',
        status: 'read'
      },
      {
        id: 'msg3',
        content: 'That\'s great news! Can you share the results?',
        timestamp: '10:33 AM',
        senderId: 'user2',
        status: 'read'
      },
      {
        id: 'msg4',
        content: 'Sure, I\'ll send them over in a bit.',
        timestamp: '10:35 AM',
        senderId: 'user1',
        status: 'read'
      }
    ],
    unreadCount: 0,
    lastMessage: {
      id: 'msg4',
      content: 'Sure, I\'ll send them over in a bit.',
      timestamp: '10:35 AM',
      senderId: 'user1',
      status: 'read'
    }
  },
  {
    id: 'conv2',
    participants: [currentUser, contacts[1]],
    messages: [
      {
        id: 'msg5',
        content: 'Did you see the game last night?',
        timestamp: 'Yesterday',
        senderId: 'user3',
        status: 'read'
      },
      {
        id: 'msg6',
        content: 'Yes! It was amazing!',
        timestamp: 'Yesterday',
        senderId: 'user1',
        status: 'read'
      }
    ],
    unreadCount: 0,
    lastMessage: {
      id: 'msg6',
      content: 'Yes! It was amazing!',
      timestamp: 'Yesterday',
      senderId: 'user1',
      status: 'read'
    }
  },
  {
    id: 'conv3',
    participants: [currentUser, contacts[2]],
    messages: [
      {
        id: 'msg7',
        content: 'Meeting tomorrow at 9?',
        timestamp: '2 days ago',
        senderId: 'user4',
        status: 'read'
      },
      {
        id: 'msg8',
        content: 'Confirmed. I\'ll be there.',
        timestamp: '2 days ago',
        senderId: 'user1',
        status: 'read'
      },
      {
        id: 'msg9',
        content: 'Great! Don\'t forget to bring the presentation.',
        timestamp: '2 days ago',
        senderId: 'user4',
        status: 'read'
      }
    ],
    unreadCount: 1,
    lastMessage: {
      id: 'msg9',
      content: 'Great! Don\'t forget to bring the presentation.',
      timestamp: '2 days ago',
      senderId: 'user4',
      status: 'read'
    }
  },
  {
    id: 'conv4',
    participants: [currentUser, contacts[3]],
    messages: [
      {
        id: 'msg10',
        content: 'How\'s the new house?',
        timestamp: 'Monday',
        senderId: 'user5',
        status: 'delivered'
      }
    ],
    unreadCount: 0,
    lastMessage: {
      id: 'msg10',
      content: 'How\'s the new house?',
      timestamp: 'Monday',
      senderId: 'user5',
      status: 'delivered'
    }
  },
  {
    id: 'conv5',
    participants: [currentUser, contacts[4]],
    messages: [
      {
        id: 'msg11',
        content: 'Can we reschedule our dinner to next week?',
        timestamp: 'Last week',
        senderId: 'user6',
        status: 'read'
      },
      {
        id: 'msg12',
        content: 'Sure, no problem. How about Tuesday?',
        timestamp: 'Last week',
        senderId: 'user1',
        status: 'read'
      }
    ],
    unreadCount: 0,
    lastMessage: {
      id: 'msg12',
      content: 'Sure, no problem. How about Tuesday?',
      timestamp: 'Last week',
      senderId: 'user1',
      status: 'read'
    }
  }
];
