import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials } from '@/adapters/auth.adapter';
import authAdapter from '@/adapters/auth.adapter';

interface FormErrors extends Partial<LoginCredentials> {
  submit?: string;
}

interface UseLoginFormReturn {
  formData: LoginCredentials;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
    if (errors[name as keyof LoginCredentials]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
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
      const response = await authAdapter.login(formData);
      console.log('Login exitoso:', response);
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
      console.error('Error en el login:', error);
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