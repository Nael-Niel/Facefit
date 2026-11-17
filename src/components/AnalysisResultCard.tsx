// src/components/AnalysisResultCard.tsx
'use client';

import React from 'react';
import {
  ClassificationResult,
} from '@/utils/faceGeometry';
import { FACE_SHAPE_INFO } from '@/data/eyewearData';
import {
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  Award,
  ChevronDown,
  Activity,
  Layers,
} from 'lucide-react';

interface AnalysisResultCardProps {
  classification: ClassificationResult;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ classification }) => {
  const { shape, confidence, primaryRuleMatched, ratios, metrics } = classification;
  const shapeInfo = FACE_SHAPE_INFO[shape];

  // Helper warna progress ring confidence
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 stroke-emerald-500';
    if (score >= 80) return 'text-blue-600 stroke-blue-500';
    return 'text-amber-600 stroke-amber-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-300/80 shadow-md p-6 space-y-6">
      {/* Header: Face Shape Badge & Confidence Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-terracotta-50 text-terracotta-700 border border-terracotta-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Hasil Klasifikasi Geometri</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-charcoal-900 tracking-tight flex items-center gap-2">
            <span>{shape} Face</span>
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5 font-medium">
            {shapeInfo?.tagline || 'Bentuk wajah terdeteksi secara matematis'}
          </p>
        </div>

        {/* Confidence Gauge Badge */}
        <div className="flex items-center space-x-3 bg-cream-100 px-4 py-2.5 rounded-xl border border-cream-300">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-cream-300"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getConfidenceColor(confidence)}
                strokeDasharray={`${confidence}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-[11px] font-bold text-charcoal-800">
              {Math.round(confidence)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-charcoal-500 uppercase tracking-wider font-semibold">
              Tingkat Keyakinan
            </div>
            <div className="text-xs font-bold text-charcoal-800">
              {confidence >= 90 ? 'Sangat Tinggi' : 'Tinggi'} ({confidence}%)
            </div>
          </div>
        </div>
      </div>

      {/* Description & Heuristic Rule Match */}
      <div className="p-3.5 rounded-xl bg-cream-100/80 border border-cream-200 text-xs text-charcoal-700 space-y-1.5">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-charcoal-900">Dasar Keputusan AI: </strong>
            {primaryRuleMatched}
          </p>
        </div>
      </div>

      {/* Geometric Ratio & Distance Metrics Table */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-600 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-olive-600" />
            <span>Pengukuran Koordinat & Rasio Geometri</span>
          </h3>
          <span className="text-[11px] text-charcoal-400">478 Facial Landmarks</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Metric 1 */}
          <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
            <span className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider block">
              Panjang (P)
            </span>
            <div className="text-sm font-bold text-charcoal-900 mt-0.5">
              {Math.round(metrics.faceHeight)} px
            </div>
            <span className="text-[10px] text-charcoal-500">Titik 10 ke 152</span>
          </div>

          {/* Metric 2 */}
          <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
            <span className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider block">
              Lebar Pipi (L_pipi)
            </span>
            <div className="text-sm font-bold text-charcoal-900 mt-0.5">
              {Math.round(metrics.cheekboneWidth)} px
            </div>
            <span className="text-[10px] text-charcoal-500">Titik 234 ke 454</span>
          </div>

          {/* Metric 3 */}
          <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
            <span className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider block">
              Lebar Dahi (L_dahi)
            </span>
            <div className="text-sm font-bold text-charcoal-900 mt-0.5">
              {Math.round(metrics.foreheadWidth)} px
            </div>
            <span className="text-[10px] text-charcoal-500">Titik 103 ke 332</span>
          </div>

          {/* Metric 4 */}
          <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
            <span className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider block">
              Lebar Rahang (L_rahang)
            </span>
            <div className="text-sm font-bold text-charcoal-900 mt-0.5">
              {Math.round(metrics.jawWidth)} px
            </div>
            <span className="text-[10px] text-charcoal-500">Titik 172 ke 397</span>
          </div>
        </div>

        {/* Ratios Breakdown */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="px-3 py-2 rounded-lg bg-white border border-cream-300">
            <div className="text-[10px] text-charcoal-500">P / L_pipi</div>
            <div className="text-xs font-bold text-charcoal-900">{ratios.lengthToWidth}</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-white border border-cream-300">
            <div className="text-[10px] text-charcoal-500">L_rahang / L_pipi</div>
            <div className="text-xs font-bold text-charcoal-900">{ratios.jawToCheek}</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-white border border-cream-300">
            <div className="text-[10px] text-charcoal-500">L_dahi / L_pipi</div>
            <div className="text-xs font-bold text-charcoal-900">{ratios.foreheadToCheek}</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-white border border-cream-300">
            <div className="text-[10px] text-charcoal-500">L_dahi / L_rahang</div>
            <div className="text-xs font-bold text-charcoal-900">{ratios.foreheadToJaw}</div>
          </div>
        </div>
      </div>

      {/* Styling Advice Section */}
      <div className="p-4 rounded-xl bg-olive-50/70 border border-olive-200/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-olive-900 flex items-center gap-1.5 mb-1.5">
          <Award className="w-4 h-4 text-olive-600" />
          <span>Rekomendasi Styling Ahli</span>
        </h4>
        <p className="text-xs text-olive-950 leading-relaxed font-medium">
          {shapeInfo?.stylingAdvice}
        </p>
      </div>
    </div>
  );
};
