import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const ValidationErrorTooltip: React.FC<{ message: string }> = ({ message }) => {
  if (!message) {
    return null;
  }
  return (
    <div 
      className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm rounded-md py-1.5 px-3 z-10 shadow-lg"
      role="alert"
    >
      {message}
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-red-600" />
    </div>
  );
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loginView, setLoginView] = useState<'customer' | 'admin'>('customer');

  const showValidationError = (
      errorSetter: React.Dispatch<React.SetStateAction<string>>,
      timeoutRef: React.MutableRefObject<number | undefined>,
      message: string
  ) => {
      window.clearTimeout(timeoutRef.current);
      errorSetter(message);
      timeoutRef.current = window.setTimeout(() => {
          errorSetter('');
      }, 3000);
  };

  const CustomerView = () => {
    const [name, setName] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [nameError, setNameError] = useState('');
    const [dayError, setDayError] = useState('');
    const [monthError, setMonthError] = useState('');
    const [whatsappError, setWhatsappError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const nameErrorTimeout = useRef<number | undefined>(undefined);
    const dayErrorTimeout = useRef<number | undefined>(undefined);
    const monthErrorTimeout = useRef<number | undefined>(undefined);
    const whatsappErrorTimeout = useRef<number | undefined>(undefined);

    useEffect(() => {
        return () => {
            window.clearTimeout(nameErrorTimeout.current);
            window.clearTimeout(dayErrorTimeout.current);
            window.clearTimeout(monthErrorTimeout.current);
            window.clearTimeout(whatsappErrorTimeout.current);
        };
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^[a-zA-Z\u00C0-\u017F\s]*$/.test(value)) {
        setName(value);
        setNameError('');
      } else {
        showValidationError(setNameError, nameErrorTimeout, 'Apenas letras e espaços são permitidos.');
      }
    };

    const handleNumericChange = (
      setter: React.Dispatch<React.SetStateAction<string>>,
      errorSetter: React.Dispatch<React.SetStateAction<string>>,
      timeoutRef: React.MutableRefObject<number | undefined>
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        setter(value);
        errorSetter('');
      } else {
        showValidationError(errorSetter, timeoutRef, 'Apenas números são permitidos.');
      }
    };
    
    const isSubmitDisabled = !!(nameError || dayError || monthError || whatsappError);

    return (
      <>
        <div>
          <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900">
            Any <span className="text-pink-600">Hair</span>
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Seu agendamento de beleza, simplificado.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin('customer'); }}>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                id="name"
                name="name"
                type="text"
                label="Nome"
                placeholder="Seu nome completo"
                required
                value={name}
                onChange={handleNameChange}
              />
              <ValidationErrorTooltip message={nameError} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  id="birth-day"
                  name="birth-day"
                  type="text"
                  label="Dia Aniv."
                  placeholder="DD"
                  required
                  value={birthDay}
                  onChange={handleNumericChange(setBirthDay, setDayError, dayErrorTimeout)}
                  maxLength={2}
                />
                <ValidationErrorTooltip message={dayError} />
              </div>
              <div className="relative">
                <Input
                  id="birth-month"
                  name="birth-month"
                  type="text"
                  label="Mês Aniv."
                  placeholder="MM"
                  required
                  value={birthMonth}
                  onChange={handleNumericChange(setBirthMonth, setMonthError, monthErrorTimeout)}
                  maxLength={2}
                />
                <ValidationErrorTooltip message={monthError} />
              </div>
            </div>
            <div className="relative">
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                label="WhatsApp"
                placeholder="(00) 00000-0000"
                required
                value={whatsapp}
                onChange={handleNumericChange(setWhatsapp, setWhatsappError, whatsappErrorTimeout)}
              />
              <ValidationErrorTooltip message={whatsappError} />
            </div>
            <Input id="email-address" name="email" type="email" label="Email" autoComplete="email" required placeholder="seu@email.com" />
            <div>
              <Input 
                id="password" 
                name="password" 
                type={isPasswordVisible ? 'text' : 'password'}
                label="Senha" 
                autoComplete="current-password" 
                required 
                placeholder="********"
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="text-gray-500 focus:outline-none focus:text-gray-700"
                    aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <i className={`fas ${isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </button>
                }
              />
            </div>
          </div>

          <div>
            <Button type="submit" fullWidth disabled={isSubmitDisabled}>
              Cadastrar e Entrar
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Ou continue com</span>
          </div>
        </div>
        <div>
          <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2">
            <i className="fab fa-google"></i>
            Fazer cadastro com Gmail
          </Button>
        </div>
        <div>
            <Button variant="secondary" fullWidth onClick={() => setLoginView('admin')}>
                Acessar como Dono(a)
            </Button>
        </div>
      </>
    );
  };


  const AdminView = () => {
    // Definindo credenciais padrão para o administrador
    const MASTER_USERNAME = 'admin';
    const MASTER_PASSWORD = 'admin123';

    const [isAdminPasswordVisible, setIsAdminPasswordVisible] = useState(false);
    const [adminName, setAdminName] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const nameErrorTimeout = useRef<number | undefined>(undefined);
    const passwordErrorTimeout = useRef<number | undefined>(undefined);

    useEffect(() => {
        return () => {
            window.clearTimeout(nameErrorTimeout.current);
            window.clearTimeout(passwordErrorTimeout.current);
        };
    }, []);

    const handleAdminNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Permitir apenas letras e espaços para o nome
        if (/^[a-zA-Z\u00C0-\u017F\s]*$/.test(value)) {
            setAdminName(value);
            if (nameError) setNameError('');
        } else {
            showValidationError(setNameError, nameErrorTimeout, 'Apenas letras e espaços são permitidos.');
        }
    };

    const handleAdminSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        let hasError = false;
        if (!adminName.trim()) {
            showValidationError(setNameError, nameErrorTimeout, 'O nome é obrigatório.');
            hasError = true;
        }
        if (!adminPassword) {
            showValidationError(setPasswordError, passwordErrorTimeout, 'A senha é obrigatória.');
            hasError = true;
        }

        if (hasError) return;

        // Validar credenciais contra o padrão definido
        if (adminName === MASTER_USERNAME && adminPassword === MASTER_PASSWORD) {
            onLogin('admin');
        } else {
            showValidationError(setPasswordError, passwordErrorTimeout, 'Nome de usuário ou senha inválidos.');
        }
    };

    return (
        <>
            <div>
                <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900">
                    Any <span className="text-pink-600">Hair</span>
                </h1>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-700">Acesso Restrito</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Faça login como administrador.
                </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleAdminSubmit}>
                <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
                    <div className="relative">
                        <Input 
                            id="admin-name" 
                            name="name" 
                            type="text" 
                            label="Nome" 
                            required 
                            placeholder="Seu nome de usuário" 
                            value={adminName}
                            onChange={(e) => {
                                setAdminName(e.target.value);
                                if (nameError) setNameError('');
                            }}
                        />
                        <ValidationErrorTooltip message={nameError} />
                    </div>
                    <div className="relative">
                        <Input 
                            id="admin-password" 
                            name="password" 
                            type={isAdminPasswordVisible ? 'text' : 'password'} 
                            label="Senha" 
                            autoComplete="current-password" 
                            required 
                            placeholder="********"
                            value={adminPassword}
                            onChange={(e) => {
                                setAdminPassword(e.target.value);
                                if (passwordError) setPasswordError('');
                            }}
                            endAdornment={
                                <button
                                    type="button"
                                    onClick={() => setIsAdminPasswordVisible(!isAdminPasswordVisible)}
                                    className="text-gray-500 focus:outline-none focus:text-gray-700"
                                    aria-label={isAdminPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    <i className={`fas ${isAdminPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                            }
                        />
                        <ValidationErrorTooltip message={passwordError} />
                    </div>
                </div>

                <div>
                    <Button type="submit" fullWidth>
                        Entrar
                    </Button>
                </div>
            </form>

            <div className="text-center mt-8 border-t pt-6">
                <Button variant="ghost" onClick={() => setLoginView('customer')}>
                    <i className="fas fa-arrow-left mr-2"></i> Voltar para a Tela Principal
                </Button>
            </div>
        </>
    );
  };


  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        {loginView === 'customer' ? <CustomerView /> : <AdminView />}
      </div>
    </div>
  );
};
