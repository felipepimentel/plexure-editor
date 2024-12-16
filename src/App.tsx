import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { AppProviders } from '@/providers/AppProviders';
import { useAuth } from '@/contexts/AuthContext';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
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
            <MainLayout />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/editor" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}