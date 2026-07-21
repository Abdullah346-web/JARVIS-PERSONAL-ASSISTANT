import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  // Do not restore a previous login when the frontend starts. Every fresh
  // browser session should begin on the login page.
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, isAuthenticated: !!token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export const useAssistantStore = create((set) => ({
  assistant: null,
  assistants: [],
  selectedAssistantType: null,

  setAssistant: (assistant) => set({ assistant }),
  setAssistants: (assistants) => set({ assistants }),
  setSelectedAssistantType: (type) => set({ selectedAssistantType: type }),
}));

export const useChatStore = create((set) => ({
  chats: [],
  currentChat: null,
  messages: [],

  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
}));

export const useSettingsStore = create((set) => ({
  settings: null,
  theme: 'dark',

  setSettings: (settings) => set({ settings }),
  setTheme: (theme) => set({ theme }),
}));
