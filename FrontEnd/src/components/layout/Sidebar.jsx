import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Text } from '../ui/Text';
import { AlertService } from '../../services/AlertService';

function SidebarItem({ href, icon, label, isActive }) {
  return (
    <Link to={href} className="block">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
          isActive 
            ? 'bg-white/10 shadow-lg shadow-blue-500/10' 
            : 'bg-transparent hover:bg-white/5'
        }`}
        style={{
          transform: isActive ? 'translateX(2px)' : 'translateX(0)',
        }}>
        <div style={{ 
          transition: 'all 0.2s',
          transform: isActive ? 'scale(1.1)' : 'scale(1)'
        }}>
          {icon}
        </div>
        <Text className={`text-base transition-colors duration-200 ${
          isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-300'
        }`}>
          {label}
        </Text>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isClient, logout } = useAuth();

  const handleLogout = async () => {
    AlertService.confirm(
      'Sair',
      'Deseja realmente sair?',
      async () => {
        await logout();
        navigate('/');
      }
    );
  };

  const userNameParts = user?.name?.split(' ') || [];
  const firstName = userNameParts[0] || '';
  const lastName = userNameParts.slice(1).join(' ') || '';

  return (
    <div className="w-64 bg-[#0f1419] border-r border-white/10 h-full flex flex-col justify-between shadow-2xl">
      <div>
        {/* Logo Section */}
        <div className="px-6 py-8 border-b border-white/10">
          <div className="mb-1">
            <Text
              className="text-2xl font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #bc7cff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 20px rgba(96, 165, 250, 0.5)',
                letterSpacing: 2,
                display: 'block',
              }}>
              SAKURA
            </Text>
          </div>
          <div>
            <Text
              className="text-2xl font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #bc7cff 0%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 20px rgba(188, 124, 255, 0.5)',
                letterSpacing: 2,
                display: 'block',
              }}>
              ARCADE
            </Text>
          </div>
        </div>

        {/* User Info Section */}
        {user && (
          <div className="px-6 py-5 border-b border-white/10">
            <div className="mb-2">
              {firstName && (
                <Text className="text-white font-semibold text-base block leading-tight">
                  {firstName}
                </Text>
              )}
              {lastName && (
                <Text className="text-white font-semibold text-base block leading-tight">
                  {lastName}
                </Text>
              )}
            </div>
            <Text className="text-gray-400 text-xs mb-3 block">{user.email}</Text>
            <div className="mt-2">
              <div className={`px-3 py-1.5 rounded-full inline-block ${
                isAdmin 
                  ? 'bg-orange-500/20 border border-orange-500/30' 
                  : 'bg-blue-500/20 border border-blue-500/30'
              }`}>
                <Text className={`text-xs font-bold uppercase tracking-wider ${
                  isAdmin ? 'text-orange-400' : 'text-blue-400'
                }`}>
                  {isAdmin ? 'ADMINISTRADOR' : 'CLIENTE'}
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="px-4 py-6">
          <SidebarItem
            href="/catalog"
            icon={<Home size={20} style={{ color: location.pathname === '/catalog' ? '#fff' : '#9ca3af' }} />}
            label="Catálogo de Jogos"
            isActive={location.pathname === '/catalog'}
          />
          {(isClient || isAdmin) && (
            <SidebarItem
              href="/library"
              icon={<BookOpen size={20} style={{ color: location.pathname === '/library' ? '#fff' : '#9ca3af' }} />}
              label="Biblioteca"
              isActive={location.pathname === '/library'}
            />
          )}
          {isAdmin && (
            <SidebarItem
              href="/users"
              icon={<Users size={20} style={{ color: location.pathname === '/users' ? '#fff' : '#9ca3af' }} />}
              label="Usuários"
              isActive={location.pathname === '/users'}
            />
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-6" style={{ zIndex: 10 }}>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 w-full cursor-pointer transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/30 active:scale-95"
          style={{
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.1)';
          }}>
          <LogOut size={20} style={{ color: '#ef4444' }} />
          <Text className="text-red-400 text-base font-semibold">Sair</Text>
        </button>
      </div>
    </div>
  );
}
