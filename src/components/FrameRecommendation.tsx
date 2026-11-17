// src/components/FrameRecommendation.tsx
'use client';

import React from 'react';
import {
  EYEWEAR_CATALOG,
  SUITABILITY_MATRIX,
  SUITABILITY_CONFIG,
  EyewearModel,
  FaceShapeType,
  SuitabilityLevel,
} from '@/data/eyewearData';
import { Glasses, Sparkles, Check, ChevronRight } from 'lucide-react';

interface FrameRecommendationProps {
  faceShape: FaceShapeType;
  selectedFrameId: string;
  onSelectFrame: (frame: EyewearModel) => void;
}

export const FrameRecommendation: React.FC<FrameRecommendationProps> = ({
  faceShape,
  selectedFrameId,
  onSelectFrame,
}) => {
  // Ambil kecocokan masing-masing kacamata dan urutkan berdasarkan skor tertinggi (Very Suitable -> Not Suitable)
  const rankedFrames = [...EYEWEAR_CATALOG]
    .map((frame) => {
      const suitability = SUITABILITY_MATRIX[faceShape][frame.category];
      const config = SUITABILITY_CONFIG[suitability];
      return {
        frame,
        suitability,
        config,
      };
    })
    .sort((a, b) => b.config.score - a.config.score);

  return (
    <div className="bg-white rounded-2xl border border-cream-300/80 shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-600">
            <Glasses className="w-4 h-4" />
            <span>Koleksi Frame & Rekomendasi</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-charcoal-900 mt-0.5">
            Pilihan Frame untuk Wajah {faceShape}
          </h3>
        </div>
        <span className="text-xs text-charcoal-500 hidden sm:inline">
          Klik frame untuk Virtual Try-On
        </span>
      </div>

      {/* Frame Cards List */}
      <div className="grid grid-cols-1 gap-3.5">
        {rankedFrames.map(({ frame, suitability, config }) => {
          const isSelected = selectedFrameId === frame.id;

          return (
            <div
              key={frame.id}
              onClick={() => onSelectFrame(frame)}
              className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-terracotta-500 bg-terracotta-50/50 ring-2 ring-terracotta-400/30 shadow-md'
                  : 'border-cream-300 hover:border-cream-400 bg-white hover:bg-cream-50/70 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* SVG Visual Preview + Info */}
                <div className="flex items-center space-x-4">
                  {/* Eyewear SVG Thumbnail */}
                  <div
                    className={`w-28 h-16 shrink-0 rounded-lg p-2 flex items-center justify-center border transition ${
                      isSelected
                        ? 'bg-white border-terracotta-300 shadow-sm'
                        : 'bg-cream-100 border-cream-200 group-hover:bg-white'
                    }`}
                    dangerouslySetInnerHTML={{ __html: frame.svgString }}
                  />

                  {/* Text Details */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
                        {frame.category}
                      </span>
                      <span className="text-cream-300">•</span>
                      <span className="text-xs text-charcoal-500 font-medium">
                        {frame.colorName}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-charcoal-900 leading-tight mt-0.5">
                      {frame.name}
                    </h4>

                    <p className="text-xs text-charcoal-500 line-clamp-1 mt-1">
                      {frame.description}
                    </p>
                  </div>
                </div>

                {/* Suitability Badge & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.badgeBg} ${config.badgeBorder}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    <span>{suitability}</span>
                  </span>

                  <button
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-terracotta-600 text-white shadow-sm'
                        : 'bg-cream-200 text-charcoal-700 hover:bg-cream-300'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Sedang Dipakai</span>
                      </>
                    ) : (
                      <>
                        <span>Coba Frame</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
