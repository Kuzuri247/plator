import React from 'react';
import { ButtonProps } from '@/lib/types';

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer border rounded-none tracking-wide uppercase text-xs md:text-sm";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-next",
    secondary: "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80",
    outline: "border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground",
    ghost: "border-transparent hover:bg-accent hover:text-accent-foreground text-muted-foreground",
  };

  const sizes = {
    sm: "h-8 px-4",
    md: "h-12 px-8",
    lg: "h-14 px-10",
    icon: "h-10 w-10",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size as keyof typeof sizes]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};