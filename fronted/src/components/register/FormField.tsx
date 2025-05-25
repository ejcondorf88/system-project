import { UserIcon, EnvelopeIcon, LockClosedIcon, KeyIcon } from '@heroicons/react/24/outline';

interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: 'user' | 'email' | 'password' | 'confirmPassword';
}

const getIcon = (icon: FormFieldProps['icon']) => {
  switch (icon) {
    case 'user':
      return <UserIcon className="h-5 w-5 text-gray-400" />;
    case 'email':
      return <EnvelopeIcon className="h-5 w-5 text-gray-400" />;
    case 'password':
      return <LockClosedIcon className="h-5 w-5 text-gray-400" />;
    case 'confirmPassword':
      return <KeyIcon className="h-5 w-5 text-gray-400" />;
  }
};

export const FormField = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  icon,
}: FormFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 pl-1">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        {getIcon(icon)}
      </div>
    </div>
  </div>
); 