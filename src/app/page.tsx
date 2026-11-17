// src/app/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FaceAnalyzer } from '@/components/FaceAnalyzer';
import { AnalysisResultCard } from '@/components/AnalysisResultCard';
import { FrameRecommendation } from '@/components/FrameRecommendation';
import { ClassificationResult } from '@/utils/faceGeometry';
import { EyewearModel, EYEWEAR_CATALOG } from '@/data/eyewearData';
import { Sparkles, Glasses, Heart, ShieldCheck, Cpu } from 'lucide-react';

export default function Home() {
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [selectedEyewear, setSelectedEyewear] = useState<EyewearModel | null>(EYEWEAR_CATALOG[0]);
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);

  const analyzerSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToAnalyzer = () => {
    if (analyzerSectionRef.current) {
      analyzerSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnalysisComplete = (result: ClassificationResult, defaultFrame: EyewearModel) => {
    setClassification(result);
    setSelectedEyewear(defaultFrame);
  };

  const handleReset = () => {
    setClassification(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Navigation */}
      <Navbar
        onOpenMatrixModal={() => setShowMatrixModal(true)}
        onScrollToAnalyzer={scrollToAnalyzer}
      />

      <main className="flex-1">
        {/* Hero Section with Matrix Modal */}
        <HeroSection
          onScrollToAnalyzer={scrollToAnalyzer}
          showMatrixModal={showMatrixModal}
          setShowMatrixModal={setShowMatrixModal}
        />

        {/* Analyzer & Try-On Section */}
        <section
          id="analyzer"
          ref={analyzerSectionRef}
          className="py-12 sm:py-16 bg-cream-200/50 border-t border-cream-300/80 transition-all"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-olive-100 text-olive-800 border border-olive-200 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-olive-600" />
                <span>AI Face Analysis & Fitting Studio</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
                Pemeriksaan Bentuk Wajah & Virtual Try-On
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-500 mt-2">
                Unggah foto wajah Anda atau gunakan webcam untuk mendeteksi 478 koordinat wajah dan mencoba kacamata secara virtual.
              </p>
            </div>

            {/* Layout Grid: Centered if no result yet, 2-column split if results available */}
            {classification ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Panel Kiri (5 Kolom): Canvas Try-on interaktif & kontrol */}
                <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-28">
                  <FaceAnalyzer
                    onAnalysisComplete={handleAnalysisComplete}
                    onReset={handleReset}
                    selectedEyewear={selectedEyewear}
                    onSelectEyewear={setSelectedEyewear}
                  />
                </div>

                {/* Panel Kanan (6 Kolom): Hasil Analisis (Atas) & Rekomendasi Frame (Bawah) */}
                <div className="lg:col-span-6 xl:col-span-6 space-y-6">
                  {/* Panel Kanan Atas: Badge Bentuk Wajah, Confidence, Tabel Metrik Rasio */}
                  <AnalysisResultCard classification={classification} />

                  {/* Panel Kanan Bawah: Katalog Frame dengan badge kecocokan warna-warni */}
                  <FrameRecommendation
                    faceShape={classification.shape}
                    selectedFrameId={selectedEyewear?.id || ''}
                    onSelectFrame={(frame) => setSelectedEyewear(frame)}
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <FaceAnalyzer
                  onAnalysisComplete={handleAnalysisComplete}
                  onReset={handleReset}
                  selectedEyewear={selectedEyewear}
                  onSelectEyewear={setSelectedEyewear}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-charcoal-950 text-cream-200 py-12 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-terracotta-600 flex items-center justify-center text-white">
                <Glasses className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  Face<span className="text-terracotta-400">Fit</span>
                </span>
                <p className="text-xs text-charcoal-400">
                  Web-Based Eyewear Recommendation & Virtual Try-On System
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-charcoal-400">
              <div className="flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-terracotta-400" />
                <span>Client-Side MediaPipe Face Landmarker</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-olive-400" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Geometric Heuristic Classifier</span>
              </div>
            </div>

            <div className="text-xs text-charcoal-500 text-center md:text-right">
              &copy; {new Date().getFullYear()} FaceFit AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
