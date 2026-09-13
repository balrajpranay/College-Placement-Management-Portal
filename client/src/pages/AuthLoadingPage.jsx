import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

export default function AuthLoadingPage() {
  const navigate = useNavigate();
  return (
    <AuthLoadingScreen
      title="Securing Your Placement Workspace"
      subtitle="Verifying credentials and loading 600+ placement & internship opportunities"
      manualAction={{
        label: "Go to Opportunities Hub →",
        onClick: () => navigate('/student/opportunities')
      }}
    />
  );
}
