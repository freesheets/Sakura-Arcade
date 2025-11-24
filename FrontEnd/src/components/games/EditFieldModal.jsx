import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateGame } from '../../data/games/updateGame';
import { useQueryClient } from '@tanstack/react-query';
import { Text } from '../ui/Text';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { AlertService } from '../../services/AlertService';

export function EditFieldModal({ visible, onClose, game, field, fieldLabel }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState('');

  const platformOptions = [
    { value: 'PS5', label: 'PlayStation 5' },
    { value: 'PS4', label: 'PlayStation 4' },
    { value: 'PS3', label: 'PlayStation 3' },
    { value: 'XBOX', label: 'Xbox' },
    { value: 'PC', label: 'PC' },
    { value: 'NINTENDO', label: 'Nintendo Switch' },
  ];

  const multiplayerOptions = [
    { value: 'true', label: 'Sim' },
    { value: 'false', label: 'Não' },
  ];

  useEffect(() => {
    if (game && visible) {
      if (field === 'multiplayer') {
        setValue(game.multiplayer ? 'true' : 'false');
      } else if (field === 'title') {
        setValue(game.title || '');
      } else {
        setValue((game[field] || ''));
      }
    }
  }, [game, field, visible]);

  const handleSubmit = async () => {
    if (!game || game.id === undefined || game.id === null) {
      AlertService.error('Erro', 'Jogo não encontrado');
      return;
    }

    const gameId = typeof game.id === 'string' ? Number(game.id) : game.id;
    if (isNaN(gameId) || gameId <= 0) {
      AlertService.error('Erro', 'ID do jogo inválido');
      return;
    }
    setIsSubmitting(true);

    try {
      const updateData = {};
      
      if (field === 'multiplayer') {
        updateData.multiplayer = value === 'true';
      } else {
        updateData[field] = value;
      }

      await updateGame(gameId, updateData);

      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['games', game.uuid] });

      AlertService.success('Sucesso!', `${fieldLabel} atualizado com sucesso!`);
      onClose();
    } catch (error) {
      AlertService.error('Erro', error.message || 'Erro ao atualizar informação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!game || !visible) return null;

  const isSelectField = field === 'platform' || field === 'multiplayer';
  const options = field === 'platform' ? platformOptions : multiplayerOptions;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[#0a0c10] rounded-2xl border border-white/10 shadow-2xl">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl p-6">
          <div className="flex-row items-center justify-between flex">
            <Text className="text-xl font-bold text-white">
              Editar {fieldLabel}
            </Text>
            <button
              onClick={onClose}
              className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition">
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <Text className="text-white font-semibold mb-3">{fieldLabel}</Text>
            {isSelectField ? (
              <Select
                options={options}
                value={value}
                onValueChange={setValue}
                placeholder={`Selecione ${fieldLabel.toLowerCase()}`}
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  field === 'title' ? 'Digite o título do jogo' :
                  field === 'imageUrl' ? 'https://exemplo.com/imagem.jpg' :
                  field === 'languages' ? 'Ex: PT BR, EN, ES' :
                  'Ex: 48 GB'
                }
                className="bg-white/5 border-white/10 text-white"
                multiline={field === 'languages'}
                rows={field === 'languages' ? 3 : 1}
              />
            )}
          </div>

          <div className="flex-row gap-3 flex">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 transition">
              <Text className="text-center text-white">Cancelar</Text>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition rounded-xl py-3 disabled:opacity-60">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                <Text className="text-center text-white font-semibold">Salvar</Text>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

