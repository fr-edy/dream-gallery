"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TelegramLogin from './TelegramLogin';
import AppleLiquidGlass from './AppleLiquidGlass';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full">
        <AppleLiquidGlass
          backgroundImage="/images/landing-bg.jpeg"
          className="min-h-screen w-full"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </AppleLiquidGlass>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen w-full">
        <AppleLiquidGlass
          backgroundImage="/images/landing-bg.jpeg"
          className="min-h-screen w-full"
        >
          <div className="container mx-auto px-4 py-8">
            {/* Navigation */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </Link>
            </div>

            {/* Authentication Required */}
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <TelegramLogin
                  botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'dreamerbotbot'}
                  className="flex justify-center"
                />
              </div>
            </div>
          </div>
        </AppleLiquidGlass>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;