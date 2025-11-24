import React from 'react';
import { cn } from '../../lib/utils';
import { Text } from './Text';
import { TextClassContext } from './Text';

const buttonVariants = {
  default: 'bg-primary shadow-sm shadow-black/5 hover:bg-primary/90 text-primary-foreground',
  destructive: 'bg-destructive shadow-sm shadow-black/5 hover:bg-destructive/90 dark:bg-destructive/60 text-white',
  outline: 'border border-border bg-background shadow-sm shadow-black/5 hover:bg-accent dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
  secondary: 'bg-secondary shadow-sm shadow-black/5 hover:bg-secondary/80 text-secondary-foreground',
  ghost: 'hover:bg-accent dark:hover:bg-accent/50',
  link: 'text-primary underline-offset-4 hover:underline',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2 sm:h-9',
  sm: 'h-9 gap-1.5 rounded-md px-3 sm:h-8',
  lg: 'h-11 rounded-md px-6 sm:h-10',
  icon: 'h-10 w-10 sm:h-9 sm:w-9',
};

const buttonTextVariants = {
  default: 'text-primary-foreground',
  destructive: 'text-white',
  outline: 'group-hover:text-accent-foreground',
  secondary: 'text-secondary-foreground',
  ghost: 'group-active:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default',
  children,
  disabled,
  ...props 
}) {
  return (
    <TextClassContext.Provider value={cn('text-sm font-medium text-foreground pointer-events-none transition-colors', buttonTextVariants[variant])}>
      <button
        className={cn(
          'group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'whitespace-nowrap outline-none transition-all',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={disabled}
        role="button"
        {...props}
      >
        {children}
      </button>
    </TextClassContext.Provider>
  );
}

