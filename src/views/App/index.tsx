import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { MainLayout } from '@/components/navigation/MainLayout';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { AppProviders } from '@/providers/AppProviders';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Editor } from '@/views/Editor';

interface AppProps {
  darkMode?: boolean;
}

function AppRoutes({ darkMode = true }: AppProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <Routes future={{ v7_startTransition: true }}>
      <Route
        path="/login"
        element={
          user ? <Navigate to="/editor" replace /> : <LoginForm />
        }
      />
      <Route
        path="/editor"
        element={
          <PrivateRoute>
            <MainLayout>
              <Editor />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/editor" replace />} />
    </Routes>
  );
}

export function App({ darkMode = true }: AppProps) {
  return (
    <AppProviders>
      <AppRoutes darkMode={darkMode} />
    </AppProviders>
  );
}