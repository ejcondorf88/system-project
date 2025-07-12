import { useState, useEffect } from 'react';
import axios from 'axios';

interface Membership {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
}

interface UserMembership {
  id: number;
  user_id: number;
  membership_id: number;
  start_date: string;
  end_date: string;
  user: {
    username: string;
    email: string;
  };
  membership: {
    name: string;
    price: number;
  };
}

export default function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [userMemberships, setUserMemberships] = useState<UserMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'memberships' | 'user-memberships'>('memberships');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Obtener membresías
      const membershipsResponse = await axios.get('http://localhost:8080/api/memberships/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMemberships(membershipsResponse.data);

      // Obtener membresías de usuarios
      const userMembershipsResponse = await axios.get('http://localhost:8080/api/user-memberships/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserMemberships(userMembershipsResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-4xl mx-auto mt-10">
        <div className="text-white text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-orange-400 mb-6">Gestión de Membresías</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('memberships')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'memberships' 
              ? 'bg-orange-500 text-white' 
              : 'bg-white/10 text-white hover:bg-orange-500/30'
          }`}
        >
          Membresías Disponibles
        </button>
        <button
          onClick={() => setActiveTab('user-memberships')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'user-memberships' 
              ? 'bg-orange-500 text-white' 
              : 'bg-white/10 text-white hover:bg-orange-500/30'
          }`}
        >
          Membresías de Usuarios
        </button>
      </div>

      {activeTab === 'memberships' && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Membresías Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberships.map((membership) => (
              <div key={membership.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-lg font-bold text-orange-400 mb-2">{membership.name}</h4>
                <p className="text-gray-300 mb-2">{membership.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">${membership.price}</span>
                  <span className="text-blue-400">{membership.duration_days} días</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'user-memberships' && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Membresías de Usuarios</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-2">Usuario</th>
                  <th className="text-left py-2">Membresía</th>
                  <th className="text-left py-2">Inicio</th>
                  <th className="text-left py-2">Fin</th>
                  <th className="text-left py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {userMemberships.map((userMembership) => {
                  const endDate = new Date(userMembership.end_date);
                  const isActive = endDate > new Date();
                  
                  return (
                    <tr key={userMembership.id} className="border-b border-white/10">
                      <td className="py-2">{userMembership.user.username}</td>
                      <td className="py-2">{userMembership.membership.name}</td>
                      <td className="py-2">{new Date(userMembership.start_date).toLocaleDateString()}</td>
                      <td className="py-2">{endDate.toLocaleDateString()}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isActive ? 'Activa' : 'Expirada'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 