import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  icon: React.ReactNode;
  validation?: (value: string, allValues?: Record<string, string>) => string | null;
}

export interface GlassFormProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  onSubmit: (data: Record<string, string>) => void;
  fields: FormField[];
  submitButtonText?: string;
  footerContent?: React.ReactNode;
}

export const GlassForm: React.FC<GlassFormProps> = ({
  title,
  subtitle,
  icon,
  onSubmit,
  fields,
  submitButtonText = 'Enviar',
  footerContent
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.validation) {
        const error = field.validation(formData[field.name], formData);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  return (
    <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
      {/* Header */}
      <div className="text-center mb-8">
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl mb-4 border border-white/30">
            {icon}
          </div>
        )}
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>

      {/* Campos do formulário */}
      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {field.icon}
              </div>
              <input
                type={
                  field.type === 'password' && !showPasswords[field.name]
                    ? 'password'
                    : 'text'
                }
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder={field.placeholder}
                className="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-200"
              />
              {field.type === 'password' && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors"
                >
                  {showPasswords[field.name] ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
            {errors[field.name] && (
              <p className="mt-1.5 text-xs text-red-200 ml-1">{errors[field.name]}</p>
            )}
          </div>
        ))}

        {/* Botão de submissão */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {submitButtonText}
        </button>
      </div>

      {/* Footer customizável */}
      {footerContent && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/60">ou</span>
            </div>
          </div>
          <div className="text-center">{footerContent}</div>
        </>
      )}
    </div>
  );
};