import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CreatorProfile, Role } from '../types';
import { INITIAL_USERS, INITIAL_CREATORS } from '../data/mockData';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  creator: CreatorProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, username: string, password?: string) => Promise<void>;
  logout: () => void;
  switchDemoUser: (role: Role | 'sarah' | 'marcus') => void;
  updateCreatorProfile: (updates: Partial<CreatorProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Alex Rivera for instant demo preview
  const [user, setUser] = useState<User | null>(INITIAL_USERS[0]);
  const [creator, setCreator] = useState<CreatorProfile | null>(INITIAL_CREATORS[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('digiprofile_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        const matchCreator = INITIAL_CREATORS.find(c => c.userId === parsed.id || c.username === parsed.username);
        if (matchCreator) {
          setCreator(matchCreator);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      if (res.creator) {
        setCreator(res.creator);
      } else {
        const found = INITIAL_CREATORS.find(c => c.userId === res.user.id || c.username === res.user.username);
        setCreator(found || null);
      }
      localStorage.setItem('digiprofile_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, username: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, username, password);
      setUser(res.user);
      setCreator(res.creator);
      localStorage.setItem('digiprofile_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCreator(null);
    localStorage.removeItem('digiprofile_user');
  };

  const switchDemoUser = (target: Role | 'sarah' | 'marcus') => {
    if (target === 'admin') {
      const adminUser = INITIAL_USERS.find(u => u.role === 'admin') || INITIAL_USERS[3];
      setUser(adminUser);
      setCreator(null);
      localStorage.setItem('digiprofile_user', JSON.stringify(adminUser));
    } else if (target === 'customer') {
      const customerUser = INITIAL_USERS.find(u => u.role === 'customer') || INITIAL_USERS[4];
      setUser(customerUser);
      setCreator(null);
      localStorage.setItem('digiprofile_user', JSON.stringify(customerUser));
    } else if (target === 'sarah') {
      const sarahUser = INITIAL_USERS[1];
      setUser(sarahUser);
      setCreator(INITIAL_CREATORS[1]);
      localStorage.setItem('digiprofile_user', JSON.stringify(sarahUser));
    } else if (target === 'marcus') {
      const marcusUser = INITIAL_USERS[2];
      setUser(marcusUser);
      setCreator(INITIAL_CREATORS[2]);
      localStorage.setItem('digiprofile_user', JSON.stringify(marcusUser));
    } else {
      // Default to Alex
      const alexUser = INITIAL_USERS[0];
      setUser(alexUser);
      setCreator(INITIAL_CREATORS[0]);
      localStorage.setItem('digiprofile_user', JSON.stringify(alexUser));
    }
  };

  const updateCreatorProfile = async (updates: Partial<CreatorProfile>) => {
    if (!creator) return;
    const updated = await api.updateCreator(creator.username, updates);
    setCreator(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        creator,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoUser,
        updateCreatorProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
