import React, { useMemo } from 'react';
import { User, Users } from 'lucide-react';

interface UserProfileProps {
  darkMode: boolean;
  userName?: string;
  teamName?: string;
  userImage?: string;
}

export function UserProfile({
  darkMode,
  userName = 'Guest User',
  teamName = 'No Team',
  userImage
}: UserProfileProps) {
  const defaultAvatar = useMemo(() => {
    if (!userName) return null;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=0ea5e9`;
  }, [userName]);

  const avatarUrl = userImage || defaultAvatar;

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
          />
        ) : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-500`}>
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex flex-col">
          <div className={`text-sm font-medium leading-tight ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {userName}
          </div>
          <div className="flex items-center gap-1">
            <Users className={`w-3.5 h-3.5 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <span className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {teamName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 