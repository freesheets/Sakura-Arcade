import React, { useState } from 'react';
import { X, Sparkles, Crown } from 'lucide-react';
import { Text } from '../ui/Text';

export function SubscriptionModal({ visible, onSelect, onClose }) {
  const [selectedType, setSelectedType] = useState(null);

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div 
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 50%, #0a0c10 100%)',
          }}
        >
          <div className="relative p-6 pb-4">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: 'linear-gradient(to right, #6b8bff, #bc7cff)',
              }}
            />
            <div className="flex-row items-center justify-between mb-4 flex relative z-10">
              <div className="flex-row items-center gap-3 flex">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-2xl">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <Text className="text-2xl font-bold text-white">
                    Escolha seu Plano
                  </Text>
                  <Text className="text-sm text-gray-400 mt-1">
                    Selecione a melhor opção para você
                  </Text>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-white/5 rounded-full p-2 hover:bg-white/10 transition">
                  <X size={20} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex-col gap-4 flex">
              <button
                onClick={() => handleSelect('assinatura_full')}
                className={`relative overflow-hidden rounded-2xl border-2 transition ${
                  selectedType === 'assinatura_full' ? 'border-purple-500' : 'border-white/10'
                }`}
              >
                <div 
                  className={`p-5 ${
                    selectedType === 'assinatura_full'
                      ? 'bg-gradient-to-br from-blue-500/15 to-purple-500/15'
                      : 'bg-white/3'
                  }`}
                >
                  <div className="flex-row items-start justify-between mb-3 flex">
                    <div className="flex-1">
                      <div className="flex-row items-center gap-2 mb-2 flex">
                        <Sparkles
                          size={20}
                          className={selectedType === 'assinatura_full' ? 'text-purple-400' : 'text-gray-400'}
                        />
                        <Text className="text-lg font-bold text-white">
                          Assinatura Full
                        </Text>
                        {selectedType === 'assinatura_full' && (
                          <div className="bg-purple-500/20 px-2 py-0.5 rounded-full">
                            <Text className="text-xs font-semibold text-purple-400">
                              Popular
                            </Text>
                          </div>
                        )}
                      </div>
                      <Text className="text-sm text-gray-400 leading-5 mb-3">
                        Acesso completo ao catálogo
                      </Text>
                    </div>
                  </div>

                  <div className="mb-4" style={{ gap: 8 }}>
                    <div className="flex-row items-center flex" style={{ gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#bc7cff' }} />
                      <Text className="text-sm text-gray-300 flex-1">
                        Até <span className="font-bold text-white">3 jogos grátis</span>
                      </Text>
                    </div>
                    <div className="flex-row items-center flex" style={{ gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#bc7cff' }} />
                      <Text className="text-sm text-gray-300 flex-1">
                        Depois de 3 jogos, paga valor cheio
                      </Text>
                    </div>
                    <div className="flex-row items-center flex" style={{ gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#bc7cff' }} />
                      <Text className="text-sm text-gray-300 flex-1">
                        Acesso por 30 dias
                      </Text>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <Text className="text-xs text-gray-400 text-center mb-1">
                      Primeiros 3 jogos
                    </Text>
                    <Text className="text-2xl font-bold text-white text-center">
                      R$ 150,00
                    </Text>
                  </div>
                </div>
              </button>
            </div>

            <Text className="text-xs text-gray-500 text-center mt-6">
              Sem assinatura, você paga o valor cheio de cada jogo
            </Text>

            <div className="flex-row gap-3 mt-6 flex">
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-1 py-4 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <Text className="text-base font-bold text-gray-300 text-center">
                    Continuar sem assinatura
                  </Text>
                </button>
              )}
              <button
                onClick={handleConfirm}
                disabled={!selectedType}
                className={`flex-1 py-4 px-6 rounded-xl transition ${
                  selectedType 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
                    : 'bg-gray-600 opacity-50'
                }`}>
                <Text className="text-base font-bold text-white text-center">
                  {selectedType ? 'Selecionar Plano' : 'Selecione um plano'}
                </Text>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

