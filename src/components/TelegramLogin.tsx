"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthenticatedUser } from '@/lib/auth';

interface TelegramLoginProps {
  botUsername?: string;
  onAuth?: (user: AuthenticatedUser) => void;
  className?: string;
}

const TelegramLogin: React.FC<TelegramLoginProps> = ({
  onAuth,
  className = ""
}) => {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) return;
    
    setIsLoading(true);
    
    // Create a user object from the entered ID
    const user: AuthenticatedUser = {
      id: parseInt(userId.trim()),
      firstName: `User${userId.trim()}`
    };
    
    // Simulate a brief loading state
    setTimeout(() => {
      login(user);
      setIsLoading(false);
      
      if (onAuth) {
        onAuth(user);
      }
    }, 500);
  };

  return (
    <div className={`telegram-login-container ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your Telegram User ID"
            className="outline-none border-none bg-transparent text-white w-64"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!userId.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TelegramLogin;