import { User } from '@supabase/supabase-js';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

interface UserProfileMenuProps {
  darkMode?: boolean;
}

export function UserProfileMenu({ darkMode = false }: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 rounded-lg p-2 transition-colors ${
          darkMode
            ? 'hover:bg-gray-700 focus:bg-gray-700'
            : 'hover:bg-gray-100 focus:bg-gray-100'
        }`}
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
          {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="text-left">
          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {profile?.full_name || user.email}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {profile?.role || 'User'}
          </div>
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } ring-1 ring-black ring-opacity-5`}
        >
          <div className="py-1">
            <button
              onClick={() => setIsOpen(false)}
              className={`flex w-full items-center px-4 py-2 text-sm ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserIcon className="mr-3 h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className={`flex w-full items-center px-4 py-2 text-sm ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className={`flex w-full items-center px-4 py-2 text-sm ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 