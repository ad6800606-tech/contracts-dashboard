import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginPage from './auth/LoginPage';
import MainLayout from './layout/MainLayout';
import Loading from './common/Loading';

const MainApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <MainLayout /> : <LoginPage />}
    </div>
  );
};

export default MainApp;