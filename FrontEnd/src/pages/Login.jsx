import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Gamepad2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Text } from '../components/ui/Text';
import { AlertService } from '../services/AlertService';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/catalog');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-[#0a0c10] min-h-screen flex">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      AlertService.warning('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate('/catalog');
      } else {
        AlertService.error('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      AlertService.error('Erro', error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex-1 min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0a0c10 0%, #142235 50%, #1a1f2e 100%)',
      }}
    >
      <div className="flex-1 flex-row flex min-h-screen">
        <div className="flex-1 items-center justify-center px-12 flex" style={{ minWidth: 350 }}>
          <div className="items-center flex flex-col">
            <div className="mb-6">
              <Text
                className="text-6xl font-extrabold mb-2"
                style={{
                  color: '#60a5fa',
                  textShadow: '0 0 25px #bc7cff',
                  letterSpacing: 2,
                }}>
                SAKURA
              </Text>
              <Text
                className="text-6xl font-extrabold"
                style={{
                  color: '#bc7cff',
                  textShadow: '0 0 25px #6b8bff',
                  letterSpacing: 2,
                }}>
                ARCADE
              </Text>
            </div>

            <Text className="text-white text-lg mb-8 text-center">
              Entre para um universo de jogos lendários
            </Text>

            <div className="bg-white/5 border border-white/10 rounded-full p-6">
              <Gamepad2 size={48} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className="flex-1 items-center justify-center px-12 flex" style={{ minWidth: 350 }}>
          <div
            className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8"
            style={{
              boxShadow: '0 0 20px rgba(96, 165, 250, 0.3)',
            }}>
            <Text className="text-3xl font-bold text-white mb-8 text-center">
              Entrar
            </Text>

            <div className="mb-6">
              <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-4 mb-2 flex">
                <Mail size={20} className="text-gray-400 mr-3" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="flex-1 bg-transparent border-0 text-white"
                  style={{ color: '#fff', fontSize: 16 }}
                />
              </div>
              {errors.email && (
                <Text className="text-red-400 text-xs mt-1">{errors.email}</Text>
              )}
            </div>

            <div className="mb-8">
              <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-4 mb-2 flex">
                <Lock size={20} className="text-gray-400 mr-3" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="flex-1 bg-transparent border-0 text-white"
                  style={{ color: '#fff', fontSize: 16 }}
                />
              </div>
              {errors.password && (
                <Text className="text-red-400 text-xs mt-1">{errors.password}</Text>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full mb-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition py-4 rounded-xl border-2 border-blue-500 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Text className="text-lg font-bold text-white">Entrar</Text>
              )}
            </button>

            <Link to="/register" className="block">
              <Text className="text-center text-gray-400 text-sm">
                Não tem uma conta? <span className="text-blue-400">Criar Conta</span>
              </Text>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

