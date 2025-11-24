import React from 'react';
import { Text } from '../ui/Text';

export function GameDetailsHeader() {
  return (
    <div className="flex-row items-center justify-between px-8 py-6 flex">
      <Text
        className="text-5xl font-extrabold"
        style={{
          color: '#bc7cff',
          textShadow: '0 0 25px #6b8bff',
          letterSpacing: 2,
          fontWeight: 900,
        }}>
        SAKURA ARCADE
      </Text>
      <div className="flex-row gap-4 items-center flex">
      </div>
    </div>
  );
}

