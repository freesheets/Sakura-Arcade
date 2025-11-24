import React from 'react';
import { cn } from '../../lib/utils';
import { Text } from './Text';
import { TextClassContext } from './Text';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-6 shadow-sm shadow-black/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <TextClassContext.Provider value="text-2xl font-semibold leading-none tracking-tight">
      <div className={className} {...props}>
        {typeof children === 'string' ? (
          <Text>{children}</Text>
        ) : (
          children
        )}
      </div>
    </TextClassContext.Provider>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <TextClassContext.Provider value="text-sm text-muted-foreground">
      {typeof children === 'string' ? (
        <Text className={className}>{children}</Text>
      ) : (
        <div className={className} {...props}>{children}</div>
      )}
    </TextClassContext.Provider>
  );
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

