import { BackgroundAnimation } from "./register/BackgroundAnimation";
import { TrialBanner } from "./register/TrialBanner";
import { TrialInfoCard } from "./register/TrialInfoCard";
import { FormField } from "./register/FormField";
import { BenefitsList } from "./register/BenefitsList";
import { TrustIndicators } from "./register/TrustIndicators";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

export const Register = () => {
  const { formData, isLoading, handleChange, handleSubmit } = useRegisterForm();
  console.log(`Los valores que se van a enviar son ${JSON.stringify(formData)}`)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackgroundAnimation />

      <div className="relative z-10 max-w-md w-full">
        <TrialBanner />

        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <RocketLaunchIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              MF-Lifting App
            </h2>
            <p className="text-gray-600 mt-2">Comienza tu transformación hoy</p>
          </div>

          <TrialInfoCard />

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="username"
              name="username"
              type="text"
              label="Nombre de usuario"
              placeholder="Tu nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              icon="user"
            />

            <FormField
              id="email"
              name="email"
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              icon="email"
            />

            <FormField
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange}
              icon="password"
            />

            <FormField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon="confirmPassword"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 hover:scale-105 hover:shadow-xl active:scale-95"
              } shadow-lg`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <RocketLaunchIcon className="h-5 w-5" />
                  <span>Comenzar Prueba Gratuita</span>
                </div>
              )}
            </button>

            <BenefitsList />

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <a
                  href="/login"
                  className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </form>
        </div>

        <TrustIndicators />
      </div>
    </div>
  );
};

export default Register;
