import React, { useState } from 'react';
import { LogIn, Mail, Lock, Github, FileCode, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface LoginFormProps {
  darkMode: boolean;
}

export function LoginForm({ darkMode }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [emailValid, setEmailValid] = useState(false);

  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValid(isValid);
    return isValid;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with GitHub');
    }
  };

  const features = [
    'Real-time collaboration',
    'Version control',
    'API testing',
    'Custom workflows'
  ];

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Branding/Welcome */}
      <div className={`hidden md:flex md:w-1/2 ${
        darkMode ? 'bg-gray-900' : 'bg-blue-50'
      } p-8 flex-col justify-center items-center relative overflow-hidden`}>
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-900/50 via-indigo-900/50 to-purple-900/50' 
              : 'bg-gradient-to-br from-blue-100 via-indigo-50 to-white'
          }`} />
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
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

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <div className="relative group">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'email'
                    ? 'text-blue-500'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all duration-200 ${
                    focusedField === 'email'
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your email"
                  required
                />
                {emailValid && email && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'password'
                    ? 'text-blue-500'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all duration-200 ${
                    focusedField === 'password'
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
                darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
              } text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

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

            <button
              onClick={handleGithubLogin}
              type="button"
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 backdrop-blur-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
              } hover:shadow-lg`}
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 