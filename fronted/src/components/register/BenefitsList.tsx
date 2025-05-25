import { CheckCircleIcon } from '@heroicons/react/24/solid';

export const BenefitsList = () => (
  <div className="mt-6 space-y-3">
    <h4 className="text-sm font-semibold text-gray-700 text-center">
      Lo que incluye tu prueba:
    </h4>
    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
      <div className="flex items-center space-x-2">
        <CheckCircleIcon className="h-4 w-4 text-green-500" />
        <span>Acceso completo</span>
      </div>
      <div className="flex items-center space-x-2">
        <CheckCircleIcon className="h-4 w-4 text-green-500" />
        <span>Todas las clases</span>
      </div>
      <div className="flex items-center space-x-2">
        <CheckCircleIcon className="h-4 w-4 text-green-500" />
        <span>Equipos premium</span>
      </div>
      <div className="flex items-center space-x-2">
        <CheckCircleIcon className="h-4 w-4 text-green-500" />
        <span>Asesoría inicial</span>
      </div>
    </div>
  </div>
); 