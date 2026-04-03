import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** White rounded-xl card wrapper — core layout primitive */
const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-xl border border-border p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
