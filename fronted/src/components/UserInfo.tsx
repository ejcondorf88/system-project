import { useEffect, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';

interface UserData {
  username: string;
  email: string;
  is_superuser?: boolean;
  is_trainer?: boolean;
}

export default function UserInfo() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { logout } = useLogout();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  if (!userData) {
    return null;
  }

  const getUserRole = () => {
    if (userData.is_superuser) return 'Administrador';
    if (userData.is_trainer) return 'Entrenador';
    return 'Usuario';
  };

  const getRoleColor = () => {
    if (userData.is_superuser) return 'text-purple-400';
    if (userData.is_trainer) return 'text-orange-400';
    return 'text-blue-400';
  };

  return (
    <div className="mt-auto pt-4 border-t border-white/20">
      {/* User Info */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
            <User size={16} className="text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {userData.username}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {userData.email}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${getRoleColor()}`}>
            {getUserRole()}
          </span>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Cerrar Sesión
      </button>
    </div>
  );
} 