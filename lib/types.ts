import React, { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
  delay?: number;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}