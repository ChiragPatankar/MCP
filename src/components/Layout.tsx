import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import Navbar from './Navbar';
import MobileNavbar from './MobileNavbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <main className={`flex-1 ${isMobile ? 'pb-16 pt-0' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;