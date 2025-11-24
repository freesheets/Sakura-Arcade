import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Text } from './Text';

export function Select({ options, value, onValueChange, placeholder = 'Selecione...', className }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2"
      >
        <Text className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className="text-muted-foreground">▼</Text>
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full px-4 py-3 text-left border-b border-border last:border-b-0 hover:bg-accent',
                  value === option.value && 'bg-accent'
                )}
              >
                <Text className={value === option.value ? 'font-semibold' : ''}>
                  {option.label}
                </Text>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

