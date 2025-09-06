"use client";

import { cn } from '@/lib/utils';
import { useEffect, useRef, ReactNode } from 'react';

declare global {
  interface Window {
    Button: any;
  }
}

interface GlassButtonProps {
  text?: string;
  size?: number;
  type?: 'rounded' | 'circle' | 'pill';
  onClick?: () => void;
  warp?: boolean;
  tintOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export default function GlassButton({
  text,
  size = 20,
  type = 'rounded',
  onClick,
  warp = false,
  tintOpacity = 0.2,
  className = '',
  style = {},
  children
}: GlassButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonInstanceRef = useRef<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') {
      return;
    }

    const createButton = () => {
      if (!window.Button || !containerRef.current) {
        return;
      }

      // Create button instance without text if children are provided
      const buttonInstance = new window.Button({
        text: children ? '' : (text || 'Button'),
        size,
        type,
        onClick,
        warp,
        tintOpacity
      });

      // Apply Tailwind classes and custom styling
      if (className) {
        buttonInstance.element.className = cn(buttonInstance.element.className, className);
      }

      // Apply custom styles
      Object.assign(buttonInstance.element.style, {
        position: 'relative',
        ...style
      });

      // If children are provided, hide the default text and use children instead
      if (children && buttonInstance.element.querySelector('.button-text')) {
        const textElement = buttonInstance.element.querySelector('.button-text');
        if (textElement) {
          textElement.style.display = 'none';
        }
      }

      // Append to container
      containerRef.current.appendChild(buttonInstance.element);
      buttonInstanceRef.current = buttonInstance;
    };

    // Check if Button class is already available
    if (window.Button) {
      createButton();
    } else {
      // Wait for Button class to be available with timeout
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      const checkForButton = () => {
        if (window.Button) {
          createButton();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkForButton, 100);
        } else {
          console.error('GlassButton: Button class not available after timeout');
        }
      };
      checkForButton();
    }

    // Cleanup function
    return () => {
      if (buttonInstanceRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(buttonInstanceRef.current.element);
        } catch (e) {
          // Element might already be removed
        }
        buttonInstanceRef.current = null;
      }
    };
  }, [text, size, type, onClick, warp, tintOpacity, className]);

  // Update styles when they change
  useEffect(() => {
    if (buttonInstanceRef.current) {
      Object.assign(buttonInstanceRef.current.element.style, {
        position: 'relative',
        ...style
      });
      
      // Update Tailwind classes
      if (className) {
        buttonInstanceRef.current.element.className = cn(
          buttonInstanceRef.current.element.className.split(' ').filter((cls: string) => 
            !cls.startsWith('bg-') && 
            !cls.startsWith('text-') && 
            !cls.startsWith('p-') && 
            !cls.startsWith('m-') &&
            !cls.startsWith('w-') &&
            !cls.startsWith('h-') &&
            !cls.startsWith('rounded-') &&
            !cls.startsWith('shadow-') &&
            !cls.startsWith('border-')
          ).join(' '),
          className
        );
      }
    }
  }, [style, className]);

  return (
    <div 
      ref={containerRef} 
      className={cn("inline-block relative", className && "glass-button-wrapper")}
      style={{ display: 'inline-block' }}
    >
      {children && (
        <div 
          ref={contentRef}
          className={cn(
            "absolute inset-0 flex items-center justify-center z-10 pointer-events-none",
            "text-white font-medium"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}