import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { getUsers } from '../data/users/getUsers';
import { useCreateUser } from '../data/users/createUser';
import { useCreateAddress } from '../data/users/createAddress';
import { useUpdateUser } from '../data/users/updateUser';
import { useUpdateAddress } from '../data/users/updateAddress';
import { useActivateUser, useDeactivateUser } from '../data/users/toggleUserStatus';
import { useDeleteUser } from '../data/users/deleteUser';
import { useAuth } from '../contexts/AuthContext';
import { AlertService } from '../services/AlertService';
import { 
  Users as UsersIcon, 
  User, 
  UserX, 
  Shield, 
  Search, 
  Plus, 
  UserCircle, 
  X, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Lock, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Text } from '../components/ui/Text';

export default function UsersScreen() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { isPending, error, data: users, refetch } = getUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Funções de formatação
  const formatPhone = (value) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
  };

  const formatCPF = (value) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/[-.]$/, '');
    }
    return value;
  };

  const formatPhoneDisplay = (value) => {
    if (!value) return '-';
    return formatPhone(value);
  };

  const formatCPFDisplay = (value) => {
    if (!value) return '-';
    return formatCPF(value);
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cpf: '',
    role: 'cliente',
    street: '',
    number: '',
    city: '',
    birthDate: '',
    expirationDate: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const createUserMutation = useCreateUser();
  const createAddressMutation = useCreateAddress();
  const updateUserMutation = useUpdateUser();
  const updateAddressMutation = useUpdateAddress();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();
  const deleteUserMutation = useDeleteUser();

  const normalizedUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    
    return users
      .filter(user => user && typeof user === 'object')
      .map(user => ({
        ...user,
        phone: user?.phone || '',
        profile: user?.role === 'admin' ? 'admin' : 'user',
        status: user?.isActive === false ? 'inactive' : 'active',
      }));
  }, [users]);

  const stats = useMemo(() => {
    if (!normalizedUsers || !Array.isArray(normalizedUsers)) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        admins: 0,
      };
    }

    const total = normalizedUsers.length;
    const active = normalizedUsers.filter(u => u?.isActive !== false && u?.isActive !== null).length;
    const inactive = normalizedUsers.filter(u => u?.isActive === false || u?.isActive === null).length;
    const admins = normalizedUsers.filter(u => u?.profile === 'admin').length;

    return { total, active, inactive, admins };
  }, [normalizedUsers]);

  const filteredUsers = useMemo(() => {
    if (!normalizedUsers || !Array.isArray(normalizedUsers)) return [];
    
    if (!searchQuery.trim()) return normalizedUsers;

    const query = searchQuery.toLowerCase().trim();
    return normalizedUsers.filter((user) => {
      if (!user) return false;
      const name = user.name?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const phone = user.phone?.toLowerCase() || '';
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }, [normalizedUsers, searchQuery]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (authLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-[#0a0c10] min-h-screen flex">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) errors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
    
    if (!isEditMode) {
      if (!formData.password.trim()) errors.password = 'Senha é obrigatória';
      else if (formData.password.length < 6) errors.password = 'Senha deve ter no mínimo 6 caracteres';
      if (!formData.phone.trim()) errors.phone = 'Telefone é obrigatório';
      if (!formData.cpf.trim()) errors.cpf = 'CPF é obrigatório';
      if (!formData.street.trim()) errors.street = 'Rua é obrigatória';
      if (!formData.number.trim()) errors.number = 'Número é obrigatório';
      if (!formData.city.trim()) errors.city = 'Cidade é obrigatória';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      AlertService.warning('Atenção', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.phone) {
        userData.phone = formData.phone.replace(/\D/g, '');
      }

      if (formData.cpf) {
        userData.cpf = formData.cpf.replace(/\D/g, '');
      }

      const userResponse = await createUserMutation.mutateAsync(userData);

      await createAddressMutation.mutateAsync({
        userId: userResponse.id,
        street: formData.street,
        number: formData.number,
        complement: undefined,
        city: formData.city,
        state: 'SP',
        zipCode: '00000-000',
        isPrimary: true,
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        cpf: '',
        role: 'cliente',
        street: '',
        number: '',
        city: '',
        birthDate: '',
        expirationDate: '',
      });
      setFormErrors({});
      
      setIsModalOpen(false);
      
      await refetch();
      
      setTimeout(() => {
        AlertService.success('Sucesso', 'Usuário cadastrado com sucesso!');
      }, 100);
    } catch (error) {
      const errorMessage = error.message || 'Erro ao cadastrar usuário';
      AlertService.error('Erro', errorMessage);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      cpf: '',
      role: 'cliente',
      street: '',
      number: '',
      city: '',
      birthDate: '',
      expirationDate: '',
    });
    setFormErrors({});
  };

  const handleEditUser = async (user) => {
    setEditingUserId(user.id);
    setIsEditMode(true);
    
    let addressData = { street: '', number: '', city: '' };
    try {
      const addressResponse = await fetch(`http://localhost:3000/addresses/${user.id}`);
      if (addressResponse.ok) {
        const addresses = await addressResponse.json();
        const primaryAddr = Array.isArray(addresses) && addresses.length > 0 
          ? addresses.find((addr) => addr.isPrimary) || addresses[0]
          : null;
        if (primaryAddr) {
          addressData = {
            street: primaryAddr.street || '',
            number: primaryAddr.number || '',
            city: primaryAddr.city || '',
          };
        }
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
    
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      phone: formatPhone(user.phone || ''),
      cpf: formatCPF(user.cpf || ''),
      role: user.role || 'cliente',
      street: addressData.street,
      number: addressData.number,
      city: addressData.city,
      birthDate: '',
      expirationDate: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUserId) return;

    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) errors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
    if (!formData.phone.trim()) errors.phone = 'Telefone é obrigatório';
    if (!formData.cpf.trim()) errors.cpf = 'CPF é obrigatório';
    if (!formData.street.trim()) errors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) errors.number = 'Número é obrigatório';
    if (!formData.city.trim()) errors.city = 'Cidade é obrigatória';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      AlertService.warning('Atenção', 'Por favor, corrija os erros no formulário');
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: editingUserId,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
          role: formData.role,
        },
      });

      await updateAddressMutation.mutateAsync({
        userId: editingUserId,
        data: {
          street: formData.street,
          number: formData.number,
          city: formData.city,
        },
      });

      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingUserId(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        cpf: '',
        role: 'cliente',
        street: '',
        number: '',
        city: '',
        birthDate: '',
        expirationDate: '',
      });
      setFormErrors({});
      await refetch();
      
      setTimeout(() => {
        AlertService.success('Sucesso', 'Usuário atualizado com sucesso!');
      }, 100);
    } catch (error) {
      const errorMessage = error.message || 'Erro ao atualizar usuário';
      AlertService.error('Erro', errorMessage);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      if (isActive) {
        await activateUserMutation.mutateAsync(userId);
        AlertService.success('Sucesso', 'Usuário ativado com sucesso!');
      } else {
        await deactivateUserMutation.mutateAsync(userId);
        AlertService.success('Sucesso', 'Usuário inativado com sucesso!');
      }
      await refetch();
    } catch (error) {
      const errorMessage = error.message || 'Erro ao alterar status do usuário';
      AlertService.error('Erro', errorMessage);
    }
  };

  const executeDeleteUser = async (userId) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      setTimeout(async () => {
        await refetch();
        AlertService.success('Sucesso', 'Usuário deletado com sucesso!');
      }, 100);
    } catch (error) {
      const errorMessage = error?.message || error?.error || 'Erro ao deletar usuário';
      AlertService.error('Erro', errorMessage);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    AlertService.confirm(
      'Confirmar exclusão',
      `Tem certeza que deseja deletar o usuário "${userName}"? Esta ação não pode ser desfeita.`,
      () => executeDeleteUser(userId)
    );
  };

  const parallaxOffset = Math.min(scrollY * 0.2, 100);

  return (
    <div className="flex-1 flex-row bg-[#0a0c10] min-h-screen flex">
      <Sidebar />

      <div className="flex-1 relative overflow-x-hidden">
        {/* Hero Section */}
        <div 
          className="relative w-full overflow-hidden"
          style={{ 
            height: '400px',
            minHeight: '400px',
          }}
        >
          {/* Animated Gradient Background */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 15s ease infinite',
              transform: `translateY(${parallaxOffset}px)`,
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10 animate-pulse"
                style={{
                  width: Math.random() * 4 + 2 + 'px',
                  height: Math.random() * 4 + 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 3 + 's',
                  animationDuration: Math.random() * 3 + 2 + 's',
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end">
            <div className="px-8 lg:px-12 pb-8 lg:pb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                      <UsersIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <Text className="text-4xl lg:text-5xl font-bold text-white mb-1" style={{
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        background: 'linear-gradient(135deg, #fff 0%, #e0e7ff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>
                        Gestão de Usuários
                      </Text>
                      <Text className="text-gray-300 text-sm lg:text-base">
                        Gerencie todos os usuários do sistema
                      </Text>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="group relative bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-6 py-3 flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 animate-fade-in"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={20} className="text-white" />
                  <Text className="text-white font-semibold">Novo Usuário</Text>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
                <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <UsersIcon size={24} className="text-purple-400" />
                    </div>
                    <Sparkles size={16} className="text-purple-400/50" />
                  </div>
                  <Text className="text-4xl font-bold text-white mb-1">
                    {isPending ? '...' : stats.total}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Total de usuários
                  </Text>
                </div>

                <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                      <User size={24} className="text-teal-400" />
                    </div>
                    <TrendingUp size={16} className="text-teal-400/50" />
                  </div>
                  <Text className="text-4xl font-bold text-white mb-1">
                    {isPending ? '...' : stats.active}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Usuários ativos
                  </Text>
                </div>

                <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                      <UserX size={24} className="text-red-400" />
                    </div>
                    <XCircle size={16} className="text-red-400/50" />
                  </div>
                  <Text className="text-4xl font-bold text-white mb-1">
                    {isPending ? '...' : stats.inactive}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Usuários inativos
                  </Text>
                </div>

                <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                      <Shield size={24} className="text-orange-400" />
                    </div>
                    <Shield size={16} className="text-orange-400/50" />
                  </div>
                  <Text className="text-4xl font-bold text-white mb-1">
                    {isPending ? '...' : stats.admins}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Administradores
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative -mt-20 z-20">
          <div className="px-8 lg:px-12 pb-12">

            {/* Search Section */}
            <div className="mb-8 animate-fade-in-delay" style={{ opacity: 0 }}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <UserCircle size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <Text className="text-2xl font-bold text-white">
                      Lista de Usuários
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Gerencie e visualize todos os usuários cadastrados
                    </Text>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <Input
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-white/10 transition-all"
                    placeholder="Buscar por nome, email ou telefone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ color: '#fff' }}
                  />
                </div>
              </div>
            </div>

            {/* Users List */}
            <div>
              {isPending ? (
                <div className="items-center justify-center py-20 flex flex-col">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                  <Text className="text-gray-400 mt-6 text-lg">Carregando usuários...</Text>
                </div>
              ) : error ? (
                <div className="items-center justify-center py-20 flex flex-col bg-white/5 backdrop-blur-md border border-red-500/20 rounded-2xl">
                  <XCircle size={48} className="text-red-400 mb-4" />
                  <Text className="text-red-400 text-xl mb-2 font-semibold">Erro ao carregar usuários</Text>
                  <Text className="text-gray-400">{error.message}</Text>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="flex-row bg-white/5 border-b border-white/10 px-6 py-4 flex">
                    <div className="flex-1">
                      <Text className="text-gray-400 text-xs font-semibold uppercase">
                        NOME
                      </Text>
                    </div>
                    <div className="flex-1">
                      <Text className="text-gray-400 text-xs font-semibold uppercase">
                        EMAIL
                      </Text>
                    </div>
                    <div className="flex-1">
                      <Text className="text-gray-400 text-xs font-semibold uppercase">
                        TELEFONE
                      </Text>
                    </div>
                    <div className="flex-1">
                      <Text className="text-gray-400 text-xs font-semibold uppercase">
                        CPF
                      </Text>
                    </div>
                    <div className="flex-1">
                      <Text className="text-gray-400 text-xs font-semibold uppercase">
                        ENDEREÇO
                      </Text>
                    </div>
                    <div className="w-24">
                      <Text className="text-gray-400 text-xs font-semibold uppercase">
                        PERFIL
                      </Text>
                    </div>
                    <div className="w-24">
                      <Text className="text-gray-400 text-xs font-semibold uppercase">
                        STATUS
                      </Text>
                    </div>
                    <div className="w-32">
                      <Text className="text-gray-400 text-xs font-semibold uppercase">
                        AÇÕES
                      </Text>
                    </div>
                  </div>

                  {!filteredUsers || filteredUsers.length === 0 ? (
                    <div className="items-center justify-center py-20 flex flex-col">
                      <UserX size={48} className="text-gray-500 mb-4" />
                      <Text className="text-gray-400 text-lg">Nenhum usuário encontrado</Text>
                      {searchQuery && (
                        <Text className="text-gray-500 text-sm mt-2">
                          Tente buscar com outros termos
                        </Text>
                      )}
                    </div>
                  ) : (
                    filteredUsers
                      .filter(user => user && user.id)
                      .map((user, index) => (
                        <div
                          key={user.id}
                          className={`group flex-row items-center px-6 py-4 flex hover:bg-white/5 transition-all duration-200 ${
                            index !== filteredUsers.length - 1 ? 'border-b border-white/5' : ''
                          }`}
                          style={{
                            animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                          }}>
                          <div className="flex-1 flex-row items-center gap-3 flex">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center flex">
                              <User size={20} className="text-blue-400" />
                            </div>
                            <Text className="text-white text-sm flex-1" style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {user?.name || '-'}
                            </Text>
                          </div>
                          <div className="flex-1">
                            <Text className="text-gray-300 text-sm" style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {user?.email || '-'}
                            </Text>
                          </div>
                          <div className="flex-1">
                            <Text className="text-gray-300 text-sm">
                              {formatPhoneDisplay(user?.phone)}
                            </Text>
                          </div>
                          <div className="flex-1">
                            <Text className="text-gray-300 text-sm" style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {formatCPFDisplay(user?.cpf)}
                            </Text>
                          </div>
                          <div className="flex-1">
                            <Text className="text-gray-300 text-sm" style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {user?.primaryAddress 
                                ? `${user.primaryAddress.street}, ${user.primaryAddress.number} - ${user.primaryAddress.city}/${user.primaryAddress.state}`
                                : '-'
                              }
                            </Text>
                          </div>
                          <div className="w-24">
                            <div className={`px-3 py-1 rounded-full ${
                              user?.profile === 'admin' 
                                ? 'bg-orange-500/20' 
                                : 'bg-gray-500/20'
                            }`}>
                              <Text className={`text-xs font-semibold text-center ${
                                user?.profile === 'admin'
                                  ? 'text-orange-400'
                                  : 'text-gray-400'
                              }`}>
                                {user?.profile === 'admin' ? 'ADMIN' : 'USER'}
                              </Text>
                            </div>
                          </div>
                          <div className="w-24">
                            <div className={`px-3 py-1 rounded-full ${
                              (user?.isActive === false || user?.isActive === null)
                                ? 'bg-red-500/20'
                                : 'bg-green-500/20'
                            }`}>
                              <Text className={`text-xs font-semibold text-center ${
                                (user?.isActive === false || user?.isActive === null)
                                  ? 'text-red-400'
                                  : 'text-green-400'
                              }`}>
                                {(user?.isActive === false || user?.isActive === null) ? 'INATIVO' : 'ATIVO'}
                              </Text>
                            </div>
                          </div>
                          <div className="w-32 flex-row items-center justify-center gap-2 flex">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="bg-blue-500/20 border border-blue-500/40 rounded-lg px-3 py-2 hover:bg-blue-500/30 hover:border-blue-500/60 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-blue-500/30">
                              <Edit size={16} className="text-blue-400" />
                            </button>
                            {(user?.isActive === false || user?.isActive === null) ? (
                              <button
                                onClick={() => handleToggleUserStatus(user.id, true)}
                                disabled={activateUserMutation.isPending}
                                className="bg-green-500/20 border border-green-500/40 rounded-lg px-3 py-2 hover:bg-green-500/30 hover:border-green-500/60 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                                <CheckCircle size={16} className="text-green-400" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleUserStatus(user.id, false)}
                                disabled={deactivateUserMutation.isPending}
                                className="bg-orange-500/20 border border-orange-500/40 rounded-lg px-3 py-2 hover:bg-orange-500/30 hover:border-orange-500/60 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                                <XCircle size={16} className="text-orange-400" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name || '')}
                              disabled={deleteUserMutation.isPending}
                              className="bg-red-500/20 border border-red-500/40 rounded-lg px-3 py-2 hover:bg-red-500/30 hover:border-red-500/60 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {filteredUsers && Array.isArray(filteredUsers) && filteredUsers.length > 0 && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
                    <UsersIcon size={16} className="text-purple-400" />
                    <Text className="text-gray-300 text-sm font-medium">
                      {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div 
            className="w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{ 
              maxWidth: 600,
              maxHeight: '90%',
              width: '100%',
            }}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 rounded-2xl">
              <div className="bg-[#0a0c10] rounded-xl" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div className="px-6 pt-6 pb-4 flex-shrink-0">
                  <div className="flex-row items-center justify-between flex">
                    <Text className="text-2xl font-bold text-white">
                      {isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
                    </Text>
                    <button
                      onClick={handleCloseModal}
                      className="bg-white/10 rounded-full p-2 hover:bg-white/20 transition">
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto px-6 flex-1" style={{ paddingBottom: 100 }}>
                  <div className="mb-4">
                    <Text className="text-white font-semibold mb-2 text-sm">
                      Nome <span className="text-red-400">*</span>
                    </Text>
                    <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                      <User size={20} className="text-gray-400 mr-3" />
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Digite o nome completo"
                        className="flex-1 text-white text-base bg-transparent border-0"
                        style={{ color: '#fff' }}
                      />
                    </div>
                    {formErrors.name && <Text className="text-red-400 text-xs mt-1">{formErrors.name}</Text>}
                  </div>

                  <div className="mb-4">
                    <Text className="text-white font-semibold mb-2 text-sm">
                      Email <span className="text-red-400">*</span>
                    </Text>
                    <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                      <Mail size={20} className="text-gray-400 mr-3" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="exemplo@email.com"
                        className="flex-1 text-white text-base bg-transparent border-0"
                        style={{ color: '#fff' }}
                      />
                    </div>
                    {formErrors.email && <Text className="text-red-400 text-xs mt-1">{formErrors.email}</Text>}
                  </div>

                  {!isEditMode && (
                    <div className="mb-4">
                      <Text className="text-white font-semibold mb-2 text-sm">
                        Senha <span className="text-red-400">*</span>
                      </Text>
                      <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                        <Lock size={20} className="text-gray-400 mr-3" />
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Digite a senha (mínimo 6 caracteres)"
                          className="flex-1 text-white text-base bg-transparent border-0"
                          style={{ color: '#fff' }}
                        />
                      </div>
                      {formErrors.password && <Text className="text-red-400 text-xs mt-1">{formErrors.password}</Text>}
                    </div>
                  )}

                  <div className="mb-4">
                    <Text className="text-white font-semibold mb-2 text-sm">
                      Telefone <span className="text-red-400">*</span>
                    </Text>
                    <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                      <Phone size={20} className="text-gray-400 mr-3" />
                      <Input
                        value={formData.phone}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          setFormData({ ...formData, phone: formatted });
                        }}
                        placeholder="(11) 99999-9999"
                        className="flex-1 text-white text-base bg-transparent border-0"
                        style={{ color: '#fff' }}
                        maxLength={15}
                      />
                    </div>
                    {formErrors.phone && <Text className="text-red-400 text-xs mt-1">{formErrors.phone}</Text>}
                  </div>

                  <div className="mb-4">
                    <Text className="text-white font-semibold mb-2 text-sm">
                      CPF <span className="text-red-400">*</span>
                    </Text>
                    <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                      <CreditCard size={20} className="text-gray-400 mr-3" />
                      <Input
                        value={formData.cpf}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value);
                          setFormData({ ...formData, cpf: formatted });
                        }}
                        placeholder="000.000.000-00"
                        className="flex-1 text-white text-base bg-transparent border-0"
                        style={{ color: '#fff' }}
                        maxLength={14}
                      />
                    </div>
                    {formErrors.cpf && <Text className="text-red-400 text-xs mt-1">{formErrors.cpf}</Text>}
                  </div>

                  <div className="mb-4">
                    <Text className="text-white font-semibold mb-2 text-sm">
                      Perfil <span className="text-red-400">*</span>
                    </Text>
                    <button
                      onClick={() => setShowRoleModal(true)}
                      className="flex-row items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full flex">
                      <div className="flex-row items-center flex-1 flex">
                        <Shield size={20} className="text-gray-400 mr-3" />
                        <Text className={formData.role ? 'text-white' : 'text-gray-400'}>
                          {formData.role === 'admin' ? 'Administrador' : formData.role === 'cliente' ? 'Cliente' : 'Selecione o perfil'}
                        </Text>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex-row items-center mb-4 mt-2 flex">
                      <MapPin size={18} className="text-gray-400 mr-2" />
                      <Text className="text-white text-lg font-semibold">Endereço</Text>
                    </div>

                    <div className="mb-4">
                      <Text className="text-white font-semibold mb-2 text-sm">
                        Rua <span className="text-red-400">*</span>
                      </Text>
                      <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                        <MapPin size={20} className="text-gray-400 mr-3" />
                        <Input
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          placeholder="Digite o nome da rua"
                          className="flex-1 text-white text-base bg-transparent border-0"
                          style={{ color: '#fff' }}
                        />
                      </div>
                      {formErrors.street && <Text className="text-red-400 text-xs mt-1">{formErrors.street}</Text>}
                    </div>

                    <div className="mb-4">
                      <Text className="text-white font-semibold mb-2 text-sm">
                        Número <span className="text-red-400">*</span>
                      </Text>
                      <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                        <Building size={20} className="text-gray-400 mr-3" />
                        <Input
                          type="number"
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          placeholder="123"
                          className="flex-1 text-white text-base bg-transparent border-0"
                          style={{ color: '#fff' }}
                        />
                      </div>
                      {formErrors.number && <Text className="text-red-400 text-xs mt-1">{formErrors.number}</Text>}
                    </div>

                    <div className="mb-6">
                      <Text className="text-white font-semibold mb-2 text-sm">
                        Cidade <span className="text-red-400">*</span>
                      </Text>
                      <div className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex">
                        <Building size={20} className="text-gray-400 mr-3" />
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Digite a cidade"
                          className="flex-1 text-white text-base bg-transparent border-0"
                          style={{ color: '#fff' }}
                        />
                      </div>
                      {formErrors.city && <Text className="text-red-400 text-xs mt-1">{formErrors.city}</Text>}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 flex-shrink-0 border-t border-white/10">
                  <div className="flex-row gap-3 flex">
                    <button
                      onClick={handleCloseModal}
                      disabled={
                        isEditMode
                          ? updateUserMutation.isPending
                          : createUserMutation.isPending || createAddressMutation.isPending
                      }
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3.5 hover:bg-white/10 transition">
                      <Text className="text-center text-white font-semibold">
                        Cancelar
                      </Text>
                    </button>
                    
                    <button
                      onClick={isEditMode ? handleUpdateUser : handleSubmit}
                      disabled={
                        isEditMode
                          ? updateUserMutation.isPending
                          : createUserMutation.isPending || createAddressMutation.isPending
                      }
                      className="flex-1 rounded-xl py-3.5 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-60">
                      {isEditMode ? (
                        updateUserMutation.isPending ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                        ) : (
                          <Text className="text-center text-white font-semibold">
                            Atualizar
                          </Text>
                        )
                      ) : createUserMutation.isPending || createAddressMutation.isPending ? (
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

          {showRoleModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]" onClick={() => setShowRoleModal(false)}>
              <div className="w-80 bg-[#0a0c10] rounded-xl border border-white/10 p-4" onClick={(e) => e.stopPropagation()}>
                <Text className="text-white font-bold text-lg mb-4">Selecione o Perfil</Text>
                <button
                  onClick={() => {
                    setFormData({ ...formData, role: 'cliente' });
                    setShowRoleModal(false);
                  }}
                  className="w-full py-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition text-left">
                  <Text className={formData.role === 'cliente' ? 'text-blue-400 font-semibold' : 'text-white'}>
                    Cliente
                  </Text>
                </button>
                <button
                  onClick={() => {
                    setFormData({ ...formData, role: 'admin' });
                    setShowRoleModal(false);
                  }}
                  className="w-full py-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition text-left">
                  <Text className={formData.role === 'admin' ? 'text-blue-400 font-semibold' : 'text-white'}>
                    Administrador
                  </Text>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

