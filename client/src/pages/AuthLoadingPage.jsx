import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

export default function AuthLoadingPage() {
  const navigate = useNavigate();
  return (
    <AuthLoadingScreen
      title="Securing Your Placement Workspace"
      subtitle="Verifying credentials and loading your placement dashboard"
      manualAction={{
        label: "Go to Dashboard →",
        onClick: () => navigate('/student/dashboard')
      }}
    />
  );
}
