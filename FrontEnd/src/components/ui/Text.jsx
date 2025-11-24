import React from 'react';
import { cn } from '../../lib/utils';

const textVariants = {
  default: '',
  h1: 'text-center text-4xl font-extrabold tracking-tight scroll-m-20 text-balance',
  h2: 'border-b border-border pb-2 text-3xl font-semibold tracking-tight scroll-m-20 first:mt-0',
  h3: 'text-2xl font-semibold tracking-tight scroll-m-20',
  h4: 'text-xl font-semibold tracking-tight scroll-m-20',
  p: 'mt-3 leading-7 sm:mt-6',
  blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
  code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
};

export const TextClassContext = React.createContext(undefined);

export function Text({ 
  className, 
  variant = 'default', 
  as: Component = 'span',
  children,
  ...props 
}) {
  const textClass = React.useContext(TextClassContext);
  const baseClasses = 'text-base text-foreground select-text';
  const variantClasses = textVariants[variant] || '';
  
  return (
    <Component
      className={cn(baseClasses, variantClasses, textClass, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

