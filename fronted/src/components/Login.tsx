import { useState } from "react";

export default function EnhancedGymLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("¡Bienvenido de vuelta! Disfruta tu entrenamiento");
    }, 2000);
  };
  const BackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-10 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <BackgroundAnimation />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-black/20 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-md w-full">
        {/* Welcome back banner */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white text-sm font-semibold backdrop-blur-sm">
            🔥 ¡Listo para entrenar! 🔥
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 relative">
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-xl"></div>

          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg relative">
              <span className="text-3xl">🏋️</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Bienvenido</h2>
            <p className="text-gray-300">Es hora de superar tus límites</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-orange-400 text-xl mb-1">💪</div>
              <div className="text-xs text-gray-300">Fuerza</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-red-400 text-xl mb-1">❤️</div>
              <div className="text-xs text-gray-300">Cardio</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-yellow-400 text-xl mb-1">⚡</div>
              <div className="text-xs text-gray-300">Energía</div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-200 pl-1"
              >
                Usuario
              </label>
              <div className="relative group">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-4 rounded-2xl border border-white/20 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white"
                  placeholder="Tu nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 group-focus-within:text-orange-400 transition-colors">
                    👤
                  </span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 pl-1"
              >
                Contraseña
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-4 rounded-2xl border border-white/20 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white pr-12"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <span>{showPassword ? "🙈" : "👁️"}</span>
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 text-orange-500 bg-transparent border-white/20 rounded focus:ring-orange-400 focus:ring-2"
                />
                Recordarme
              </label>
              <a
                href="#"
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 hover:shadow-2xl active:scale-95 shadow-lg"
              } relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Accediendo...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 relative z-10">
                  <span>🚀 Iniciar Sesión</span>
                </div>
              )}
            </button>

            {/* Social login options */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">
                  O continúa con
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-white">
                <span className="mr-2">📱</span>
                <span className="text-sm">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-white">
                <span className="mr-2">📘</span>
                <span className="text-sm">Facebook</span>
              </button>
            </div>

            {/* Register link */}
            <div className="text-center pt-4 border-t border-white/20">
              <p className="text-sm text-gray-300">
                ¿Nuevo en el gym?{" "}
                <a
                  href="/register"
                  className="font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Únete ahora
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 text-center text-xs text-white/50">
          <div className="flex items-center justify-center space-x-6">
            <span className="flex items-center space-x-1">
              <span>🔐</span>
              <span>Acceso seguro</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>⚡</span>
              <span>Inicio rápido</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>📱</span>
              <span>Multi-dispositivo</span>
            </span>
          </div>
        </div>

        {/* Motivation quote */}
        <div className="mt-8 text-center">
          <blockquote className="text-white/70 italic text-sm">
            "El dolor que sientes hoy será la fuerza que sientes mañana"
          </blockquote>
        </div>
      </div>
    </div>
  );
}
