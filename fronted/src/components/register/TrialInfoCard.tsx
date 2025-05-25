export const TrialInfoCard = () => (
  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-4 mb-6">
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">15</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Prueba Gratuita</h3>
        <p className="text-xs text-gray-600">Sin compromiso • Cancela cuando quieras</p>
      </div>
    </div>
  </div>
); 