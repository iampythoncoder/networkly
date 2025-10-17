import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-soft p-6 transition-all duration-200
        ${hover ? 'hover:shadow-lifted hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
