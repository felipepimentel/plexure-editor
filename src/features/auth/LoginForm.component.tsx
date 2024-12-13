import React, { useState } from 'react';
import { Mail, ArrowRight, Github, FileCode, CheckCircle2 } from 'lucide-react';
import { BaseForm, BaseFormField, BaseFormInput } from '../ui/Form';
import { BaseButton } from '../ui/Button';

interface LoginFormProps {
  darkMode: boolean;
}

export function LoginForm({ darkMode }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const features = [
    'Real-time API documentation preview',
    'OpenAPI and Swagger support',
    'Team collaboration features',
    'Version control integration'
  ];

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(value));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid) return;

    setLoading(true);
    setError(null);

    try {
      // Implement email login logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate error for demo
      setError('This feature is not implemented yet. Please use GitHub login.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    // Implement GitHub login logic here
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel - Features */}
      <div className={`w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="relative z-10 text-center max-w-md">
          <div className="flex items-center justify-center mb-8">
            <div className={`p-4 rounded-2xl backdrop-blur-sm ${
              darkMode ? 'bg-blue-500/10' : 'bg-blue-500/10'
            } ring-1 ring-white/10`}>
              <FileCode className={`w-16 h-16 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
          </div>
          <h1 className={`text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${
            darkMode 
              ? 'from-blue-400 to-indigo-400'
              : 'from-blue-600 to-indigo-600'
          }`}>
            Modern Swagger Editor
          </h1>
          <p className={`text-xl leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Create, edit, and document your API specifications with ease. 
            Experience the next generation of API documentation.
          </p>

          <div className="mt-12 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className={`w-5 h-5 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={`${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <div className={`px-4 py-2 rounded-lg backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            } ring-1 ring-white/10`}>
              <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>OpenAPI</span>
            </div>
            <div className={`px-4 py-2 rounded-lg backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            } ring-1 ring-white/10`}>
              <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>Swagger</span>
            </div>
            <div className={`px-4 py-2 rounded-lg backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            } ring-1 ring-white/10`}>
              <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>REST</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className={`w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
              darkMode 
                ? 'from-blue-400 to-indigo-400'
                : 'from-blue-600 to-indigo-600'
            }`}>
              Welcome Back
            </h2>
            <p className={`mt-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sign in to continue to your workspace
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg ${
              darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'
            } border backdrop-blur-sm`}>
              <p className={`text-sm ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`}>{error}</p>
            </div>
          )}

          <BaseForm onSubmit={handleEmailLogin} darkMode={darkMode} spacing="lg">
            <BaseFormField label="Email" darkMode={darkMode}>
              <div className="relative group">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'email'
                    ? 'text-blue-500'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <BaseFormInput
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email"
                  required
                  darkMode={darkMode}
                  className="pl-10"
                />
                {emailValid && email && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </BaseFormField>

            <BaseButton
              type="submit"
              disabled={loading}
              darkMode={darkMode}
              fullWidth
              className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </BaseButton>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-300'
                }`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${
                  darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                }`}>
                  Or continue with
                </span>
              </div>
            </div>

            <BaseButton
              onClick={handleGithubLogin}
              type="button"
              variant="ghost"
              darkMode={darkMode}
              fullWidth
              className={`border ${
                darkMode
                  ? 'border-gray-600 backdrop-blur-sm'
                  : 'border-gray-200'
              }`}
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </BaseButton>
          </BaseForm>
        </div>
      </div>
    </div>
  );
} 