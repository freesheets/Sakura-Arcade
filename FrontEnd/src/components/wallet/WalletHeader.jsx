import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Text } from '../ui/Text';

export function WalletHeader({ onDepositPress }) {
  const { user } = useAuth();
  const wallet = user?.wallet || 0;

  return (
    <div className="flex-row items-center gap-3 flex">
      <button
        onClick={onDepositPress}
        className="overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition px-4 py-2.5 flex items-center gap-2"
      >
        <Plus size={18} className="text-white" />
        <Text className="text-white font-bold text-sm">Depositar</Text>
      </button>

      <div className="overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-purple-500/30 px-5 py-3 flex items-center gap-2.5">
        <div className="bg-purple-500/20 rounded-full p-2">
          <Wallet size={20} className="text-purple-400" />
        </div>
        <div>
          <Text className="text-xs text-gray-400 font-medium mb-0.5">Saldo</Text>
          <Text
            className="text-lg font-extrabold"
            style={{
              color: '#a78bfa',
              textShadow: '0 0 8px #8b5cf6',
            }}>
            R$ {wallet.toFixed(2)}
          </Text>
        </div>
      </div>
    </div>
  );
}

