import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              RBFMS
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Sistema de Gestión Fitness Basado en Roles
            </p>
            <p className="text-lg text-orange-200 mb-12 max-w-2xl mx-auto">
              Plataforma integral para gimnasios que conecta administradores, entrenadores y clientes
              en un ecosistema completo de fitness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors duration-300"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre las herramientas que hacen de RBFMS la solución perfecta para tu gimnasio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CRM Module */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-400">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-gray-900">CRM Administrativo</CardTitle>
                <CardDescription className="text-gray-600">
                  Gestión completa de clientes, membresías y reportes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Gestión de clientes y usuarios</li>
                  <li>• Control de membresías</li>
                  <li>• Reportes y analytics</li>
                  <li>• Auditoría de actividades</li>
                </ul>
              </CardContent>
            </Card>

            {/* Trainer Module */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-400">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-gray-900">Panel de Entrenador</CardTitle>
                <CardDescription className="text-gray-600">
                  Herramientas especializadas para entrenadores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Creación de rutinas personalizadas</li>
                  <li>• Seguimiento de progreso</li>
                  <li>• Chat con clientes</li>
                  <li>• Dashboard de estadísticas</li>
                </ul>
              </CardContent>
            </Card>

            {/* Chat System */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-400">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-gray-900">Sistema de Chat</CardTitle>
                <CardDescription className="text-gray-600">
                  Comunicación en tiempo real con IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Chat inteligente con IA</li>
                  <li>• Asistencia personalizada</li>
                  <li>• Recomendaciones automáticas</li>
                  <li>• Historial de conversaciones</li>
                </ul>
              </CardContent>
            </Card>

            {/* Marketplace */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-400">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-gray-900">Tienda Virtual</CardTitle>
                <CardDescription className="text-gray-600">
                  Marketplace de productos fitness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Catálogo de productos</li>
                  <li>• Sistema de compras</li>
                  <li>• Gestión de inventario</li>
                  <li>• Procesamiento de pagos</li>
                </ul>
              </CardContent>
            </Card>

            {/* Routines */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-400">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-gray-900">Rutinas Personalizadas</CardTitle>
                <CardDescription className="text-gray-600">
                  Planes de entrenamiento adaptados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Rutinas personalizadas</li>
                  <li>• Seguimiento de progreso</li>
                  <li>• Ejercicios detallados</li>
                  <li>• Métricas de rendimiento</li>
                </ul>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-400">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-gray-900">Seguridad Avanzada</CardTitle>
                <CardDescription className="text-gray-600">
                  Protección de datos y privacidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Autenticación JWT</li>
                  <li>• Roles y permisos</li>
                  <li>• Auditoría completa</li>
                  <li>• Encriptación de datos</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-orange-600 to-orange-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Por qué elegir RBFMS?
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Una plataforma diseñada para optimizar la gestión de tu gimnasio
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">3</div>
              <div className="text-orange-200">Roles Especializados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5</div>
              <div className="text-orange-200">Módulos Principales</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-orange-200">Soporte IA</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-orange-200">Seguro</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para transformar tu gimnasio?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a la revolución del fitness digital con RBFMS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Comenzar Ahora
            </Link>
            <Link
              to="/login"
              className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
            >
              Acceder
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-orange-400 mb-4">RBFMS</h3>
              <p className="text-gray-400">
                Sistema de Gestión Fitness Basado en Roles
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li>CRM Administrativo</li>
                <li>Panel de Entrenador</li>
                <li>Sistema de Chat</li>
                <li>Tienda Virtual</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Características</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Gestión de Usuarios</li>
                <li>Rutinas Personalizadas</li>
                <li>Chat con IA</li>
                <li>Reportes Avanzados</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentación</li>
                <li>Chat en Vivo</li>
                <li>Base de Conocimientos</li>
                <li>Contacto</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RBFMS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 