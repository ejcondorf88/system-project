import { useState } from 'react';
import { CreditCard, Users, Calendar, DollarSign, Clock, Plus, RefreshCw, Filter, Search, Construction, Code, Zap } from 'lucide-react';

export default function Memberships() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl shadow-sm border border-slate-200">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestión de Membresías</h1>
              <p className="text-slate-600">Administra planes y suscripciones de usuarios</p>
            </div>
          </div>
        </div>

        {/* Development Status */}
        <div className=" rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 text-center">
            {/* Icon and Status */}
            <div className="mb-6">
              <div className="relative inline-block">
                <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full">
                  <Construction className="w-12 h-12 text-orange-600" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    DEV
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              🚧 Página en Desarrollo
            </h2>

            {/* Description */}
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              La funcionalidad de gestión de membresías está siendo desarrollada. 
              Pronto podrás administrar planes, suscripciones y gestionar las membresías de los usuarios.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className=" rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Planes de Membresía</h3>
                <p className="text-sm text-slate-600">
                  Crear y gestionar diferentes tipos de planes con precios y duraciones personalizables
                </p>
              </div>

              <div className=" rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Suscripciones</h3>
                <p className="text-sm text-slate-600">
                  Asignar membresías a usuarios y hacer seguimiento de sus estados y fechas
                </p>
              </div>

              <div className="rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Renovaciones</h3>
                <p className="text-sm text-slate-600">
                  Sistema automático de renovaciones y notificaciones de expiración
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Progreso del desarrollo</span>
                <span className="text-sm font-medium text-slate-700">65%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">Diseño UI/UX</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">Base de datos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-600">API Backend</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span className="text-slate-600">Frontend</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span className="text-slate-600">Testing</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                ¿Necesitas información sobre el desarrollo? Contacta al equipo técnico.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              Próximas Funcionalidades
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-slate-900">Gestión de Planes</h4>
                  <p className="text-sm text-slate-600">Crear, editar y eliminar planes de membresía</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-slate-900">Asignación de Usuarios</h4>
                  <p className="text-sm text-slate-600">Asignar membresías a usuarios específicos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-slate-900">Renovaciones Automáticas</h4>
                  <p className="text-sm text-slate-600">Sistema de renovación automática de membresías</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-slate-900">Reportes y Analytics</h4>
                  <p className="text-sm text-slate-600">Estadísticas de membresías y suscripciones</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-slate-900">Notificaciones</h4>
                  <p className="text-sm text-slate-600">Alertas de expiración y renovación</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-slate-900">Integración de Pagos</h4>
                  <p className="text-sm text-slate-600">Procesamiento de pagos para renovaciones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 