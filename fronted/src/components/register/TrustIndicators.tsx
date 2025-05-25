import { ShieldCheckIcon, BoltIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

export const TrustIndicators = () => (
  <div className="mt-6 text-center text-xs text-white/70">
    <div className="flex items-center justify-center space-x-4">
      <span className="flex items-center space-x-1">
        <ShieldCheckIcon className="h-4 w-4" />
        <span>Datos seguros</span>
      </span>
      <span className="flex items-center space-x-1">
        <BoltIcon className="h-4 w-4" />
        <span>Activación inmediata</span>
      </span>
      <span className="flex items-center space-x-1">
        <DevicePhoneMobileIcon className="h-4 w-4" />
        <span>App incluida</span>
      </span>
    </div>
  </div>
); 