import React from 'react';
import { cn } from '../../lib/utils';
import { TextClassContext } from './Text';

export function Input({ className, ...props }) {
  return (
    <TextClassContext.Provider value="text-base">
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground',
          'placeholder:text-muted-foreground',
          'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'outline-none',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

