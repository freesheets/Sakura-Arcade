import React from 'react';
import { Search, X } from 'lucide-react';
import { Text } from '../ui/Text';

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showFavoritesOnly,
  onToggleFavorites,
}) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center px-6 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:border-white/20 transition-all duration-300">
            <Search size={20} className="text-gray-400 mr-3 flex-shrink-0" />
            <input
              className="flex-1 text-white text-base bg-transparent border-0 outline-none placeholder:text-gray-500"
              placeholder="Buscar jogos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ color: '#fff' }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="ml-3 p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
