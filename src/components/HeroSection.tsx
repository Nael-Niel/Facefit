// src/components/HeroSection.tsx
'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ScanFace,
  Layers,
  Cpu,
  Shield,
  HelpCircle,
  Eye,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  SUITABILITY_MATRIX,
  SUITABILITY_CONFIG,
  FACE_SHAPE_INFO,
  FaceShapeType,
  EyewearModel,
} from '@/data/eyewearData';

interface HeroSectionProps {
  onScrollToAnalyzer: () => void;
  showMatrixModal: boolean;
  setShowMatrixModal: (open: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToAnalyzer,
  showMatrixModal,
  setShowMatrixModal,
}) => {
  const [selectedShapeFilter, setSelectedShapeFilter] = useState<FaceShapeType>('Oval');

  const faceShapes: FaceShapeType[] = ['Oval', 'Round', 'Square', 'Triangle', 'Heart', 'Diamond'];
  const frameCategories: EyewearModel['category'][] = ['Cat-eye', 'Square', 'Aviator', 'Round', 'Oval'];

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 blur-3xl -z-10">
        <div className="absolute -top-10 left-1/4 w-80 h-80 rounded-full bg-terracotta-200/50" />
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-olive-200/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-terracotta-100/70 border border-terracotta-200 text-terracotta-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <ScanFace className="w-4 h-4 text-terracotta-600" />
            <span>Client-Side AI • MediaPipe 478 Landmarks</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 leading-[1.15] tracking-tight">
            Temukan Kacamata Ideal Berdasarkan{' '}
            <span className="relative inline-block text-terracotta-600 italic">
              Geometri Wajah Anda
              <svg
                className="absolute left-0 -bottom-2 w-full h-3 text-terracotta-300 -z-10"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-charcoal-600 leading-relaxed font-normal">
            FaceFit menggabungkan deteksi 478 koordinat wajah, klasifikasi rasio matematis objektif, dan teknologi{' '}
            <strong className="font-semibold text-charcoal-800">Virtual Try-On instan</strong> tanpa perlu mengirim foto
            ke server atau menggunakan GPU mahal.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onScrollToAnalyzer}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-3.5 rounded-xl font-medium text-base text-white bg-terracotta-600 hover:bg-terracotta-700 active:scale-[0.99] transition shadow-lg shadow-terracotta-700/20"
            >
              <ScanFace className="w-5 h-5" />
              <span>Analisis Wajah & Virtual Try-On</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowMatrixModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-medium text-base text-charcoal-800 bg-white hover:bg-cream-200 border border-cream-300 transition shadow-sm"
            >
              <Layers className="w-5 h-5 text-olive-600" />
              <span>Lihat Matriks Kecocokan</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-white/70 border border-cream-300/80 shadow-sm backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-olive-100 text-olive-700 flex items-center justify-center mb-3">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-charcoal-900">100% Client-Side Privacy</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Foto Anda diproses langsung di browser. Tidak ada data wajah yang disimpan atau dikirim ke server.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-cream-300/80 shadow-sm backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-terracotta-100 text-terracotta-700 flex items-center justify-center mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-charcoal-900">Zero-Training & Ringan</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Bekerja instan dengan MediaPipe Face Landmarker dan klasifikasi heuristik matematis tanpa beban server.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-cream-300/80 shadow-sm backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-cream-200 text-charcoal-700 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4 text-terracotta-600" />
              </div>
              <h3 className="text-sm font-semibold text-charcoal-900">Presisi Auto-Scale & Angle</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Kacamata diposisikan secara otomatis mengikuti sudut kemiringan kepala dan lebar tulang pipi Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Matriks Kecocokan */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-cream-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-cream-100 border-b border-cream-300 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-terracotta-600" />
                  <h2 className="text-lg font-serif font-bold text-charcoal-900">
                    Matriks Rekomendasi Kacamata Berdasarkan Penelitian
                  </h2>
                </div>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Tabel acuan kesesuaian antara 6 bentuk wajah dan 5 model frame kacamata populer.
                </p>
              </div>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="w-8 h-8 rounded-lg bg-cream-200 text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-300 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Legend Badges */}
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <span className="font-semibold text-charcoal-700 mr-2">Indikator:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-medium">
                  ● Sangat Cocok (Very Suitable)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 font-medium">
                  ● Cocok (Suitable)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-medium">
                  ● Cukup Cocok (Moderately Suitable)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-medium">
                  ● Kurang Cocok (Not Suitable)
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-cream-300 shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-cream-200/70 text-charcoal-700 font-serif">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Bentuk Wajah</th>
                      {frameCategories.map((cat) => (
                        <th key={cat} className="py-3.5 px-3 font-semibold text-center">
                          {cat}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {faceShapes.map((shape) => {
                      const isSelected = selectedShapeFilter === shape;
                      return (
                        <tr
                          key={shape}
                          onClick={() => setSelectedShapeFilter(shape)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-terracotta-50/70 font-medium' : 'hover:bg-cream-50'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-charcoal-900 flex items-center space-x-2">
                            <span>{shape}</span>
                            {isSelected && <span className="text-[10px] text-terracotta-600 font-sans">(Dipilih)</span>}
                          </td>
                          {frameCategories.map((cat) => {
                            const level = SUITABILITY_MATRIX[shape][cat];
                            const cfg = SUITABILITY_CONFIG[level];
                            return (
                              <td key={cat} className="py-3 px-2 text-center">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${cfg.badgeBg} ${cfg.badgeBorder}`}
                                >
                                  {level}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Detail Info untuk Bentuk Wajah yang Dipilih */}
              <div className="p-4 rounded-xl bg-cream-100 border border-cream-300">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-terracotta-600" />
                  <h4 className="text-sm font-bold text-charcoal-900">
                    Panduan Gaya untuk Wajah {selectedShapeFilter}: {FACE_SHAPE_INFO[selectedShapeFilter].tagline}
                  </h4>
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {FACE_SHAPE_INFO[selectedShapeFilter].stylingAdvice}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-cream-100 border-t border-cream-300 flex justify-end">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-charcoal-800 text-white hover:bg-charcoal-900 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
