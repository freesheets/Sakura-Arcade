import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { depositMoney } from '../../data/users/depositMoney';
import { AlertService } from '../../services/AlertService';
import { useQueryClient } from '@tanstack/react-query';
import { Text } from '../ui/Text';

export function DepositModal({ visible, onClose }) {
  const { user, updateWallet, refreshWallet } = useAuth();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleDeposit = async () => {
    if (!user) {
      AlertService.error('Erro', 'Usuário não autenticado');
      return;
    }

    const cleanedAmount = amount.trim().replace(',', '.').replace(/[^\d.]/g, '');
    
    if (!cleanedAmount || cleanedAmount === '' || cleanedAmount === '.') {
      AlertService.error('Valor inválido', 'Por favor, insira um valor válido');
      return;
    }

    const depositAmount = parseFloat(cleanedAmount);
    
    if (isNaN(depositAmount) || depositAmount <= 0 || !isFinite(depositAmount)) {
      AlertService.error('Valor inválido', 'Por favor, insira um valor maior que zero');
      return;
    }

    const finalAmount = Math.round(depositAmount * 100) / 100;

    if (finalAmount <= 0) {
      AlertService.error('Valor inválido', 'O valor deve ser maior que zero');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await depositMoney({
        userId: user.id,
        amount: finalAmount,
      });

      updateWallet(result.newBalance);
      queryClient.invalidateQueries({ queryKey: ['wallet', user.id] });
      
      AlertService.success(
        'Depósito realizado! 💰',
        `R$ ${finalAmount.toFixed(2)} foram adicionados à sua carteira.\n\nNovo saldo: R$ ${result.newBalance.toFixed(2)}`
      );

      setAmount('');
      onClose();
    } catch (error) {
      let errorMessage = 'Erro ao depositar dinheiro';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.details && Array.isArray(error.details)) {
        const zodError = error.details.find((d) => d.path?.includes('amount'));
        if (zodError) {
          errorMessage = zodError.message || 'Valor inválido';
        }
      } else if (error.details && typeof error.details === 'string') {
        errorMessage = error.details;
      }
      
      AlertService.error('Erro ao depositar', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (text) => {
    const cleaned = text.replace(/[^\d,.]/g, '');
    const normalized = cleaned.replace(',', '.');
    const parts = normalized.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return normalized;
  };

  const currentWallet = user?.wallet || 0;
  const cleanedAmountForPreview = amount.trim().replace(',', '.').replace(/[^\d.]/g, '');
  const depositValue = cleanedAmountForPreview && cleanedAmountForPreview !== '.' 
    ? (parseFloat(cleanedAmountForPreview) || 0) 
    : 0;
  const newBalance = currentWallet + depositValue;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-0.5 rounded-2xl">
          <div className="bg-[#0a0c10] rounded-xl">
            <div className="px-6 pt-6 pb-4">
              <div className="flex-row items-center justify-between flex">
                <div className="flex-row items-center gap-3 flex">
                  <div className="bg-green-500/20 rounded-full p-3">
                    <Wallet size={24} className="text-green-400" />
                  </div>
                  <div>
                    <Text className="text-2xl font-bold text-white">
                      Depositar Dinheiro
                    </Text>
                    <Text className="text-sm text-gray-400 mt-1">
                      Adicione fundos à sua carteira
                    </Text>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="bg-white/10 rounded-full p-2 hover:bg-white/20 transition">
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <Text className="text-xs text-gray-400 mb-1">Saldo Atual</Text>
                <Text
                  className="text-3xl font-extrabold"
                  style={{
                    color: '#a78bfa',
                    textShadow: '0 0 10px #8b5cf6',
                  }}>
                  R$ {currentWallet.toFixed(2)}
                </Text>
              </div>

              <div className="mb-4">
                <Text className="text-white font-semibold mb-2 text-sm">
                  Valor do Depósito
                </Text>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4">
                  <div className="flex-row items-center gap-2 flex">
                    <Text className="text-2xl font-bold text-white">R$</Text>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(formatAmount(e.target.value))}
                      placeholder="0,00"
                      className="flex-1 text-white text-2xl font-bold bg-transparent border-0 outline-none"
                      style={{ color: '#fff' }}
                    />
                  </div>
                </div>
              </div>

              {depositValue > 0 && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex-row items-center justify-between flex">
                    <div>
                      <Text className="text-xs text-green-400 mb-1">Novo Saldo</Text>
                      <Text className="text-xl font-bold text-green-400">
                        R$ {newBalance.toFixed(2)}
                      </Text>
                    </div>
                    <div className="bg-green-500/20 rounded-full p-2">
                      <Text className="text-green-400 font-bold text-sm">+{depositValue.toFixed(2)}</Text>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-row gap-3 flex">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3.5 hover:bg-white/10 transition">
                  <Text className="text-center text-white font-semibold">
                    Cancelar
                  </Text>
                </button>
                
                <button
                  onClick={handleDeposit}
                  disabled={isSubmitting || depositValue <= 0}
                  className="flex-1 rounded-xl py-3.5 overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition disabled:opacity-60"
                  style={{ opacity: isSubmitting || depositValue <= 0 ? 0.6 : 1 }}>
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <Text className="text-center text-white font-semibold">
                      Depositar
                    </Text>
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

