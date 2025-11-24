import React, { useState } from 'react';
import { X, Gamepad2, Image as ImageIcon, ChevronRight, ChevronDown, Users } from 'lucide-react';
import { createGame } from '../../data/games/createGame';
import { useQueryClient } from '@tanstack/react-query';
import { Text } from '../ui/Text';
import { Input } from '../ui/Input';
import { AlertService } from '../../services/AlertService';

export function CreateGameModal({ visible, onClose }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    uuid: '',
    title: '',
    imageUrl: '',
    quantity: 0,
    description: '',
    platform: '',
    size: '',
    multiplayer: false,
    languages: '',
    price: 0,
  });

  const [multiplayerType, setMultiplayerType] = useState('');
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showMultiplayerModal, setShowMultiplayerModal] = useState(false);
  const [showMultiplayerTypeModal, setShowMultiplayerTypeModal] = useState(false);

  const platformOptions = [
    { value: 'PS5', label: 'PlayStation 5' },
    { value: 'PS4', label: 'PlayStation 4' },
    { value: 'PS3', label: 'PlayStation 3' },
    { value: 'XBOX', label: 'Xbox' },
    { value: 'PC', label: 'PC' },
    { value: 'NINTENDO', label: 'Nintendo Switch' },
    { value: 'MultiPlataforma', label: 'MultiPlataforma' },
  ];

  const multiplayerOptions = [
    { value: 'true', label: 'Sim' },
    { value: 'false', label: 'Não' },
  ];

  const multiplayerTypeOptions = [
    { value: 'COOP', label: 'COOP' },
    { value: 'MOBA', label: 'MOBA' },
    { value: 'Single Player', label: 'Single Player' },
  ];

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      AlertService.warning('Atenção', 'Por favor, preencha o título do jogo');
      return;
    }

    if (!formData.imageUrl.trim()) {
      AlertService.warning('Atenção', 'Por favor, preencha a URL da imagem');
      return;
    }

    if (formData.quantity < 0) {
      AlertService.warning('Atenção', 'A quantidade deve ser maior ou igual a zero');
      return;
    }

    if (!formData.uuid) {
      formData.uuid = generateUUID();
    }

    setIsSubmitting(true);

    try {
      await createGame({
        ...formData,
        multiplayer: formData.multiplayer ?? false,
      });

      setFormData({
        uuid: '',
        title: '',
        imageUrl: '',
        quantity: 0,
        description: '',
        platform: '',
        size: '',
        multiplayer: false,
        languages: '',
        price: 0,
      });
      setMultiplayerType('');

      queryClient.invalidateQueries({ queryKey: ['games'] });

      AlertService.success('Sucesso!', 'Jogo cadastrado com sucesso!');
      onClose();
    } catch (error) {
      AlertService.error('Erro', error.message || 'Erro ao cadastrar jogo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh]">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 rounded-2xl">
            <div className="bg-[#0a0c10] rounded-xl">
              <div className="px-6 pt-6 pb-4">
                <div className="flex-row items-center justify-between flex">
                  <Text className="text-2xl font-bold text-white">
                    Novo Jogo
                  </Text>
                  <button
                    onClick={onClose}
                    className="bg-white/10 rounded-full p-2 hover:bg-white/20 transition">
                    <X size={20} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto px-6" style={{ maxHeight: 'calc(90vh - 120px)', paddingBottom: 24 }}>
                <div className="mb-4">
                  <Text className="text-white font-semibold mb-2 text-sm">
                    Titulo do Jogo <span className="text-red-400">*</span>
                  </Text>
                  <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                    <Gamepad2 size={20} className="text-gray-400 mr-3" />
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Digite o titulo do jogo"
                      className="flex-1 text-white text-base bg-transparent border-0"
                      style={{ color: '#fff' }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Text className="text-white font-semibold mb-2 text-sm">
                    URL da Imagem <span className="text-red-400">*</span>
                  </Text>
                  <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                    <ImageIcon size={20} className="text-gray-400 mr-3" />
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="flex-1 text-white text-base bg-transparent border-0"
                      style={{ color: '#fff' }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Text className="text-white font-semibold mb-2 text-sm">
                    Descrição
                  </Text>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Digite a descrição do jogo"
                      className="w-full text-white text-base bg-transparent border-0 outline-none resize-none"
                      rows={4}
                      style={{ color: '#fff', minHeight: 80 }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Text className="text-white font-semibold mb-2 text-sm">
                    Plataforma
                  </Text>
                  <button
                    onClick={() => setShowPlatformModal(true)}
                    className="flex-row items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full flex">
                    <div className="flex-row items-center flex-1 flex">
                      <Gamepad2 size={20} className="text-gray-400 mr-3" />
                      <Text className={formData.platform ? 'text-white' : 'text-gray-400'}>
                        {formData.platform 
                          ? platformOptions.find(p => p.value === formData.platform)?.label 
                          : 'Selecione a plataforma'}
                      </Text>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex-row gap-3 flex">
                    <div className="flex-1">
                      <Text className="text-white font-semibold mb-2 text-sm">
                        Tamanho
                      </Text>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <Input
                          value={formData.size}
                          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                          placeholder="Ex: 50 GB"
                          className="text-white text-base bg-transparent border-0"
                          style={{ color: '#fff' }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <Text className="text-white font-semibold mb-2 text-sm">
                        Idioma
                      </Text>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <Input
                          value={formData.languages}
                          onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                          placeholder="Ex: PT-BR, EN"
                          className="text-white text-base bg-transparent border-0"
                          style={{ color: '#fff' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <Text className="text-white font-semibold mb-2 text-sm">
                    Multiplayer
                  </Text>
                  <div className="flex-row gap-3 flex">
                    <div className="flex-1">
                      <button
                        onClick={() => setShowMultiplayerModal(true)}
                        className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full flex">
                        <Users size={20} className="text-gray-400 mr-3" />
                        <Text className="text-white">
                          {formData.multiplayer ? 'Sim' : 'Não'}
                        </Text>
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <button
                        onClick={() => setShowMultiplayerTypeModal(true)}
                        className="flex-row items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full flex">
                        <Text className={multiplayerType ? 'text-white' : 'text-gray-400'}>
                          {multiplayerType || 'Ex: COOP'}
                        </Text>
                        <ChevronDown size={20} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex-row gap-3 flex">
                    <div className="flex-1">
                      <Text className="text-white font-semibold mb-2 text-sm">
                        Quantidade <span className="text-red-400">*</span>
                      </Text>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <Input
                          type="number"
                          value={formData.quantity.toString()}
                          onChange={(e) => {
                            const num = parseInt(e.target.value) || 0;
                            setFormData({ ...formData, quantity: num });
                          }}
                          placeholder="0"
                          className="text-white text-base bg-transparent border-0"
                          style={{ color: '#fff' }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <Text className="text-white font-semibold mb-2 text-sm">
                        Preço (R$)
                      </Text>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.price?.toString() || '0'}
                          onChange={(e) => {
                            const num = parseFloat(e.target.value.replace(',', '.')) || 0;
                            setFormData({ ...formData, price: num });
                          }}
                          placeholder="0,00"
                          className="text-white text-base bg-transparent border-0"
                          style={{ color: '#fff' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-row gap-3 mt-2 flex">
                  <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3.5 hover:bg-white/10 transition">
                    <Text className="text-center text-white font-semibold">
                      Cancelar
                    </Text>
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl py-3.5 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-60">
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                    ) : (
                      <Text className="text-center text-white font-semibold">
                        Cadastrar
                      </Text>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPlatformModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]" onClick={() => setShowPlatformModal(false)}>
          <div className="w-80 bg-[#0a0c10] rounded-xl border border-white/10 p-4" onClick={(e) => e.stopPropagation()}>
            <Text className="text-white font-bold text-lg mb-4">Selecione a Plataforma</Text>
            {platformOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFormData({ ...formData, platform: option.value });
                  setShowPlatformModal(false);
                }}
                className="w-full py-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition text-left">
                <Text className={formData.platform === option.value ? 'text-blue-400 font-semibold' : 'text-white'}>
                  {option.label}
                </Text>
              </button>
            ))}
          </div>
        </div>
      )}

      {showMultiplayerModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]" onClick={() => setShowMultiplayerModal(false)}>
          <div className="w-80 bg-[#0a0c10] rounded-xl border border-white/10 p-4" onClick={(e) => e.stopPropagation()}>
            <Text className="text-white font-bold text-lg mb-4">Multiplayer</Text>
            {multiplayerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFormData({ ...formData, multiplayer: option.value === 'true' });
                  setShowMultiplayerModal(false);
                }}
                className="w-full py-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition text-left">
                <Text className={(formData.multiplayer ? 'true' : 'false') === option.value ? 'text-blue-400 font-semibold' : 'text-white'}>
                  {option.label}
                </Text>
              </button>
            ))}
          </div>
        </div>
      )}

      {showMultiplayerTypeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]" onClick={() => setShowMultiplayerTypeModal(false)}>
          <div className="w-80 bg-[#0a0c10] rounded-xl border border-white/10 p-4" onClick={(e) => e.stopPropagation()}>
            <Text className="text-white font-bold text-lg mb-4">Tipo de Multiplayer</Text>
            {multiplayerTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setMultiplayerType(option.value);
                  setShowMultiplayerTypeModal(false);
                }}
                className="w-full py-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition text-left">
                <Text className={multiplayerType === option.value ? 'text-blue-400 font-semibold' : 'text-white'}>
                  {option.label}
                </Text>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

