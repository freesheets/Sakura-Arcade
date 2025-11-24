import React, { useEffect, useState } from 'react';
import { X, Gamepad2, Wallet, Check, ArrowDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserWallet } from '../../data/users/getUserWallet';
import { Text } from '../ui/Text';

export function PurchaseConfirmModal({
  visible,
  onClose,
  onConfirm,
  gameTitle,
  gamePrice,
  isProcessing = false,
}) {
  const { user, refreshWallet } = useAuth();
  const [currentWallet, setCurrentWallet] = useState(user?.wallet || 0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  if (gamePrice <= 0) {
    return null;
  }

  useEffect(() => {
    if (user?.wallet !== undefined) {
      setCurrentWallet(user.wallet);
    }
  }, [user?.wallet]);

  useEffect(() => {
    if (visible && user) {
      loadWallet();
      const interval = setInterval(() => {
        loadWallet();
      }, 1500);
      return () => clearInterval(interval);
    } else if (visible) {
      setCurrentWallet(user?.wallet || 0);
    }
  }, [visible, user]);

  const loadWallet = async () => {
    if (!user) {
      setCurrentWallet(user?.wallet || 0);
      return;
    }
    
    setIsLoadingBalance(true);
    try {
      const walletData = await getUserWallet(user.id);
      const newWalletValue = walletData.wallet;
      setCurrentWallet(newWalletValue);
      refreshWallet();
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
      setCurrentWallet(user?.wallet || 0);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const newBalance = currentWallet - gamePrice;
  const hasEnoughBalance = currentWallet >= gamePrice;
  const difference = gamePrice - currentWallet;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div 
          className={`p-0.5 rounded-2xl ${
            hasEnoughBalance 
              ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
              : 'bg-gradient-to-br from-red-500 to-red-600'
          }`}
        >
          <div className="bg-[#0a0c10] rounded-xl">
            <div className="px-6 pt-6 pb-4">
              <div className="flex-row items-center justify-between flex">
                <div className="flex-row items-center gap-3 flex">
                  <div className={`rounded-full p-3 ${hasEnoughBalance ? 'bg-purple-500/20' : 'bg-red-500/20'}`}>
                    <Gamepad2
                      size={24}
                      className={hasEnoughBalance ? 'text-purple-400' : 'text-red-400'}
                    />
                  </div>
                  <div>
                    <Text className="text-2xl font-bold text-white">
                      Confirmar Compra
                    </Text>
                    <Text className="text-sm text-gray-400 mt-1">
                      {hasEnoughBalance ? 'Finalize sua compra' : 'Saldo insuficiente'}
                    </Text>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="bg-white/10 rounded-full p-2 hover:bg-white/20 transition">
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                <Text className="text-xs text-gray-400 mb-1">Jogo</Text>
                <Text className="text-lg font-bold text-white">{gameTitle}</Text>
              </div>

              <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                <Text className="text-xs text-gray-400 mb-1">Preço</Text>
                <Text
                  className="text-3xl font-extrabold"
                  style={{
                    color: '#bc7cff',
                    textShadow: '0 0 10px #8b5cf6',
                  }}>
                  R$ {gamePrice.toFixed(2)}
                </Text>
              </div>

              <div className="mb-4 p-4 border border-purple-500/20 rounded-xl overflow-hidden relative">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                  }}
                />
                <div className="relative z-10">
                  <div className="flex-row items-center justify-between flex">
                    <div className="flex-1">
                      <div className="flex-row items-center gap-2 mb-1 flex">
                        <Text className="text-xs text-gray-400 font-medium">Saldo Atual</Text>
                        {isLoadingBalance && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                        )}
                      </div>
                      <Text
                        className="text-2xl font-extrabold"
                        style={{
                          color: '#a78bfa',
                          textShadow: '0 0 8px #8b5cf6',
                        }}>
                        R$ {currentWallet.toFixed(2)}
                      </Text>
                    </div>
                    <div className="bg-purple-500/20 rounded-full p-3">
                      <Wallet size={24} className="text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 border border-red-500/20 rounded-xl overflow-hidden relative">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1))',
                  }}
                />
                <div className="relative z-10">
                  <div className="flex-row items-center justify-between mb-3 flex">
                    <div className="flex-row items-center gap-2 flex">
                      <ArrowDown size={16} className="text-red-400" />
                      <Text className="text-xs text-red-400 font-semibold">Subtração</Text>
                    </div>
                    <Text className="text-xl font-bold text-red-400">
                      - R$ {gamePrice.toFixed(2)}
                    </Text>
                  </div>
                  
                  <div className="h-px bg-red-500/30 my-3" />
                  
                  <div className="flex-row items-center justify-between flex">
                    <Text className="text-sm text-gray-300 font-semibold">Novo Saldo</Text>
                    <div className="flex-row items-center gap-2 flex">
                      <Text
                        className={`text-2xl font-extrabold ${
                          hasEnoughBalance ? 'text-green-400' : 'text-red-400'
                        }`}
                        style={{
                          textShadow: hasEnoughBalance ? '0 0 8px #10b981' : '0 0 8px #ef4444',
                        }}>
                        R$ {newBalance.toFixed(2)}
                      </Text>
                      {hasEnoughBalance && (
                        <div className="bg-green-500/20 rounded-full p-1">
                          <Check size={14} className="text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!hasEnoughBalance && (
                <div className="mb-4 p-4 border border-red-500/30 rounded-xl overflow-hidden relative">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1))',
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex-row items-center justify-center gap-2 mb-2 flex">
                      <Text className="text-2xl">⚠️</Text>
                      <Text className="text-sm text-red-400 text-center font-bold">
                        Saldo Insuficiente
                      </Text>
                    </div>
                    <Text className="text-xs text-red-300 text-center mb-2">
                      Você não possui saldo suficiente para completar esta compra
                    </Text>
                    <div className="bg-red-500/20 rounded-lg p-2 mt-2">
                      <Text className="text-xs text-red-200 text-center">
                        Faltam: <span className="font-bold text-red-400">R$ {difference.toFixed(2)}</span>
                      </Text>
                    </div>
                  </div>
                </div>
              )}

              {hasEnoughBalance && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <Text className="text-xs text-green-400 text-center font-medium">
                    ✓ Você possui saldo suficiente para esta compra
                  </Text>
                </div>
              )}

              <div className="flex-row gap-3 flex">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3.5 hover:bg-white/10 transition">
                  <Text className="text-center text-white font-semibold">
                    Cancelar
                  </Text>
                </button>
                
                <button
                  onClick={onConfirm}
                  disabled={isProcessing || !hasEnoughBalance}
                  className={`flex-1 rounded-xl py-3.5 overflow-hidden transition ${
                    isProcessing || !hasEnoughBalance ? 'opacity-60' : ''
                  }`}
                  style={{
                    background: hasEnoughBalance 
                      ? 'linear-gradient(to right, #6b8bff, #bc7cff)' 
                      : 'linear-gradient(to right, #6b7280, #4b5563)',
                  }}>
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <div className="flex-row items-center gap-2 justify-center flex">
                      <Check size={18} className="text-white" />
                      <Text className="text-center text-white font-semibold">
                        Confirmar Compra
                      </Text>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

