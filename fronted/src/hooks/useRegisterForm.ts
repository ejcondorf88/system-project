import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RegisterCredentials } from '@/adapters/auth.adapter';
import authAdapter from '@/adapters/auth.adapter';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

interface UseRegisterFormReturn {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const useRegisterForm = (): UseRegisterFormReturn => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterCredentials> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAdapter.register(formData as RegisterCredentials);
      console.log('Registro exitoso:', response);
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        setTimeout(() => {
          navigate('/chat');
        }, 100);
      } else if (response.token) {
        localStorage.setItem('token', response.token);
        setTimeout(() => {
          navigate('/chat');
        }, 100);
      } else {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      if (error instanceof Error) {
        setErrors(prev => ({
          ...prev,
          submit: error.message
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isLoading
  };
};
