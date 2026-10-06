import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import ToastContainer from '../common/Toast';
import TemplateSelectorModal from '../../pages/journal/TemplateSelectorModal';

export default function AppLayout() {
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar onOpenTemplateSelector={() => setIsTemplateSelectorOpen(true)} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header onOpenTemplateSelector={() => setIsTemplateSelectorOpen(true)} />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
          <Outlet context={{ openTemplateSelector: () => setIsTemplateSelectorOpen(true) }} />
        </main>

        {/* Mobile Navigation */}
        <MobileNav onOpenTemplateSelector={() => setIsTemplateSelectorOpen(true)} />
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Global Template Selector Modal */}
      <TemplateSelectorModal
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
      />
    </div>
  );
}

