import React from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  HelpCircle,
  Bell
} from 'lucide-react';

interface UserMenuProps {
  darkMode: boolean;
  userName: string;
  avatarUrl?: string;
  onProfile: () => void;
  onSettings: () => void;
  onHelp: () => void;
  onLogout: () => void;
}

export function UserMenu({
  darkMode,
  userName,
  avatarUrl,
  onProfile,
  onSettings,
  onHelp,
  onLogout
}: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItemClass = `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
    darkMode
      ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-200'
      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
  }`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
          darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
        }`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        )}
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {userName}
        </span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg ${
          darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="p-2 space-y-1">
            <button onClick={onProfile} className={menuItemClass}>
              <User className="w-4 h-4" />
              Profile
            </button>
            <button onClick={onSettings} className={menuItemClass}>
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button onClick={onHelp} className={menuItemClass}>
              <HelpCircle className="w-4 h-4" />
              Help & Documentation
            </button>
            <div className={`h-px mx-2 my-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
            <button onClick={onLogout} className={`${menuItemClass} text-red-500 hover:text-red-600`}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 