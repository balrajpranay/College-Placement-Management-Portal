import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIAdvisor from '../components/AIAdvisor';

export default function PublicLayout() {
  return (
    <div className="public-site-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Navbar />
      <main style={{ flex: '1 0 auto', width: '100%' }}>
        <Outlet />
      </main>
      <Footer />
      {/* Floating AI Technical Tutor & Career Advisor Widget */}
      <AIAdvisor />
    </div>
  );
}
