import React from 'react';

export function PlayStationLogo({ size = 20 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: '#006FCD',
        borderRadius: size * 0.2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <span
        style={{
          color: '#fff',
          fontSize: size * 0.5,
          fontWeight: 'bold',
        }}>
        PS
      </span>
    </div>
  );
}

