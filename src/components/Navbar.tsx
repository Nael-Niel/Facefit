// src/components/Navbar.tsx
'use client';

import React from 'react';
import { Glasses, Sparkles, HelpCircle, Layers, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenMatrixModal?: () => void;
  onScrollToAnalyzer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMatrixModal, onScrollToAnalyzer }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cream-100/90 border-b border-cream-300/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-800 flex items-center justify-center text-white shadow-md shadow-terracotta-800/20">
              <Glasses className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-900">
                  Face<span className="text-terracotta-500">Fit</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-olive-100 text-olive-800 border border-olive-300">
                  AI Studio
                </span>
              </div>
              <p className="text-xs text-charcoal-500 hidden sm:block tracking-wide">
                Virtual Try-On & Geometric Eyewear Fitting
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-charcoal-700">
            <button
              onClick={onScrollToAnalyzer}
              className="hover:text-terracotta-600 transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-terracotta-500" />
              <span>Face Analyzer</span>
            </button>

            <button
              onClick={onOpenMatrixModal}
              className="hover:text-terracotta-600 transition-colors flex items-center space-x-1.5"
            >
              <Layers className="w-4 h-4 text-olive-600" />
              <span>Matriks Kecocokan</span>
            </button>

            <div className="h-4 w-px bg-cream-300" />

            <div className="flex items-center space-x-1 text-xs text-charcoal-500 bg-cream-200/80 px-3 py-1.5 rounded-full border border-cream-300/80">
              <ShieldCheck className="w-3.5 h-3.5 text-olive-600" />
              <span>100% Client-Side Privacy</span>
            </div>
          </nav>

          {/* Action CTA */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onScrollToAnalyzer}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 transition shadow-sm hover:shadow-md hover:shadow-terracotta-600/25"
            >
              <Glasses className="w-4 h-4" />
              <span>Mulai Fitting</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
