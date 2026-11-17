// src/data/samplePhotos.ts

export interface SampleFace {
  id: string;
  name: string;
  shapeHint: 'Oval' | 'Round' | 'Square';
  gender: string;
  description: string;
  thumbnailUrl: string;
  // Pre-calculated geometric metrics for instant offline fallback if needed
  fallbackRatios: {
    lengthToWidth: number;
    jawToCheek: number;
    foreheadToCheek: number;
    foreheadToJaw: number;
  };
}

// 3 High-Fidelity SVG Portrait Images with clear facial contours, eyes, nose, and lips
// Dimensions: 400x500
export const SAMPLE_PHOTOS: SampleFace[] = [
  {
    id: 'sample-oval',
    name: 'Wajah Oval',
    shapeHint: 'Oval',
    gender: 'Wanita',
    description: 'Proporsi seimbang, panjang wajah lebih dominan, garis rahang melengkung lembut.',
    fallbackRatios: {
      lengthToWidth: 1.38,
      jawToCheek: 0.81,
      foreheadToCheek: 0.83,
      foreheadToJaw: 1.02,
    },
    thumbnailUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs>
        <radialGradient id="bg-oval" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%23F3EDE6"/>
          <stop offset="100%" stop-color="%23DDD2C7"/>
        </radialGradient>
        <radialGradient id="skin-oval" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="%23F9E1D2"/>
          <stop offset="60%" stop-color="%23E8C4B0"/>
          <stop offset="100%" stop-color="%23C99C83"/>
        </radialGradient>
        <linearGradient id="hair-oval" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%232C1E17"/>
          <stop offset="100%" stop-color="%23190E0A"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(%23bg-oval)"/>
      <!-- Shoulders & Neck -->
      <path d="M 160 380 L 160 440 C 160 470 60 480 30 500 L 370 500 C 340 480 240 470 240 440 L 240 380 Z" fill="%23DDB9A5"/>
      <path d="M 90 490 C 140 440 260 440 310 490 Z" fill="%237C432B"/>
      <!-- Hair Back -->
      <path d="M 120 180 C 100 280 110 380 130 420 C 270 420 290 380 280 180 Z" fill="url(%23hair-oval)"/>
      <!-- Face Oval Silhouette (Width ~170, Height ~235 -> Ratio ~1.38) -->
      <ellipse cx="200" cy="245" rx="85" ry="118" fill="url(%23skin-oval)"/>
      <!-- Cheeks Blush -->
      <ellipse cx="150" cy="265" rx="20" ry="14" fill="%23E78B78" fill-opacity="0.25"/>
      <ellipse cx="250" cy="265" rx="20" ry="14" fill="%23E78B78" fill-opacity="0.25"/>
      <!-- Eyes & Eyebrows -->
      <!-- Eyebrows -->
      <path d="M 135 210 Q 155 200 178 206" stroke="%233A261C" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M 265 210 Q 245 200 222 206" stroke="%233A261C" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Left Eye -->
      <ellipse cx="155" cy="225" rx="14" ry="7" fill="%23FFFFFF"/>
      <circle cx="155" cy="225" r="5" fill="%234A3125"/>
      <circle cx="157" cy="223" r="1.8" fill="%23FFFFFF"/>
      <!-- Right Eye -->
      <ellipse cx="245" cy="225" rx="14" ry="7" fill="%23FFFFFF"/>
      <circle cx="245" cy="225" r="5" fill="%234A3125"/>
      <circle cx="247" cy="223" r="1.8" fill="%23FFFFFF"/>
      <!-- Nose Bridge & Tip (Nose bridge ~ (200, 230), Tip ~ (200, 275)) -->
      <path d="M 200 215 L 198 268 Q 200 275 205 273" stroke="%23C29177" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="200" cy="275" rx="7" ry="4" fill="%23C29177" fill-opacity="0.6"/>
      <!-- Lips -->
      <path d="M 182 312 Q 200 306 218 312 Q 200 326 182 312 Z" fill="%23C85E53"/>
      <path d="M 186 312 Q 200 316 214 312" stroke="%237C2D24" stroke-width="1.5" fill="none"/>
      <!-- Front Hair & Parting -->
      <path d="M 115 190 C 110 130 160 90 200 90 C 250 90 290 130 285 190 C 275 145 240 135 200 135 C 160 135 125 145 115 190 Z" fill="url(%23hair-oval)"/>
    </svg>`,
  },
  {
    id: 'sample-round',
    name: 'Wajah Bulat (Round)',
    shapeHint: 'Round',
    gender: 'Pria',
    description: 'Panjang dan lebar wajah hampir seimbang, tulang pipi penuh, rahang melengkung lembut.',
    fallbackRatios: {
      lengthToWidth: 1.12,
      jawToCheek: 0.85,
      foreheadToCheek: 0.83,
      foreheadToJaw: 0.98,
    },
    thumbnailUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs>
        <radialGradient id="bg-round" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%23EBEFEA"/>
          <stop offset="100%" stop-color="%23CBD4CA"/>
        </radialGradient>
        <radialGradient id="skin-round" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="%23F7E5D9"/>
          <stop offset="60%" stop-color="%23ECCAB7"/>
          <stop offset="100%" stop-color="%23CFA38D"/>
        </radialGradient>
        <linearGradient id="hair-round" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%231E1E1E"/>
          <stop offset="100%" stop-color="%233A3A3A"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(%23bg-round)"/>
      <!-- Shoulders & Neck -->
      <path d="M 150 375 L 150 440 C 150 470 50 480 20 500 L 380 500 C 350 480 250 470 250 440 L 250 375 Z" fill="%23E0BEAB"/>
      <path d="M 80 490 C 140 435 260 435 320 490 Z" fill="%236B7F5E"/>
      <!-- Face Round Silhouette (Width ~190, Height ~215 -> Ratio ~1.13) -->
      <circle cx="200" cy="250" r="98" fill="url(%23skin-round)"/>
      <!-- Full Soft Cheeks -->
      <ellipse cx="145" cy="270" rx="22" ry="16" fill="%23E59B8B" fill-opacity="0.2"/>
      <ellipse cx="255" cy="270" rx="22" ry="16" fill="%23E59B8B" fill-opacity="0.2"/>
      <!-- Eyebrows -->
      <path d="M 135 210 Q 155 204 175 208" stroke="%23242424" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M 265 210 Q 245 204 225 208" stroke="%23242424" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <!-- Left Eye -->
      <ellipse cx="155" cy="225" rx="13" ry="7" fill="%23FFFFFF"/>
      <circle cx="155" cy="225" r="5" fill="%232A2421"/>
      <circle cx="157" cy="223" r="1.8" fill="%23FFFFFF"/>
      <!-- Right Eye -->
      <ellipse cx="245" cy="225" rx="13" ry="7" fill="%23FFFFFF"/>
      <circle cx="245" cy="225" r="5" fill="%232A2421"/>
      <circle cx="247" cy="223" r="1.8" fill="%23FFFFFF"/>
      <!-- Nose -->
      <path d="M 200 215 L 198 268 Q 200 274 205 272" stroke="%23BA8870" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="200" cy="274" rx="8" ry="4.5" fill="%23BA8870" fill-opacity="0.6"/>
      <!-- Lips -->
      <path d="M 180 315 Q 200 310 220 315 Q 200 328 180 315 Z" fill="%23BC6B60"/>
      <!-- Short Modern Hair -->
      <path d="M 105 210 C 100 130 140 100 200 100 C 260 100 300 130 295 210 C 285 160 250 148 200 148 C 150 148 115 160 105 210 Z" fill="url(%23hair-round)"/>
    </svg>`,
  },
  {
    id: 'sample-square',
    name: 'Wajah Kotak (Square)',
    shapeHint: 'Square',
    gender: 'Pria / Wanita',
    description: 'Dahi lebar, garis rahang tegas dan bersudut tajam dengan proporsi dahi, pipi, dan rahang yang sejajar.',
    fallbackRatios: {
      lengthToWidth: 1.18,
      jawToCheek: 0.94,
      foreheadToCheek: 0.91,
      foreheadToJaw: 0.97,
    },
    thumbnailUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs>
        <radialGradient id="bg-sq" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%23F2EFE9"/>
          <stop offset="100%" stop-color="%23D6D0C5"/>
        </radialGradient>
        <radialGradient id="skin-sq" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="%23F4E0CE"/>
          <stop offset="60%" stop-color="%23E5BEA4"/>
          <stop offset="100%" stop-color="%23C29377"/>
        </radialGradient>
        <linearGradient id="hair-sq" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%232D211A"/>
          <stop offset="100%" stop-color="%23170E08"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(%23bg-sq)"/>
      <!-- Shoulders & Neck -->
      <path d="M 155 375 L 155 440 C 155 470 50 480 20 500 L 380 500 C 350 480 245 470 245 440 L 245 375 Z" fill="%23DBB39B"/>
      <path d="M 80 490 C 140 435 260 435 320 490 Z" fill="%234A2C1D"/>
      <!-- Defined Square Face Contour (Angular Jawline) -->
      <path d="M 115 180 C 115 150 140 140 200 140 C 260 140 285 150 285 180 L 288 280 C 288 325 260 345 235 352 L 200 358 L 165 352 C 140 345 112 325 112 280 Z"
            fill="url(%23skin-sq)"/>
      <!-- Eyebrows (Strong architectural arches) -->
      <path d="M 130 208 Q 155 198 178 206" stroke="%2326160F" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M 270 208 Q 245 198 222 206" stroke="%2326160F" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <!-- Eyes -->
      <ellipse cx="155" cy="225" rx="14" ry="7" fill="%23FFFFFF"/>
      <circle cx="155" cy="225" r="5.2" fill="%2326160F"/>
      <circle cx="157" cy="223" r="1.8" fill="%23FFFFFF"/>
      <ellipse cx="245" cy="225" rx="14" ry="7" fill="%23FFFFFF"/>
      <circle cx="245" cy="225" r="5.2" fill="%2326160F"/>
      <circle cx="247" cy="223" r="1.8" fill="%23FFFFFF"/>
      <!-- Nose -->
      <path d="M 200 212 L 197 266 Q 200 273 206 270" stroke="%23AF7D61" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="200" cy="273" rx="7.5" ry="4" fill="%23AF7D61" fill-opacity="0.6"/>
      <!-- Angular Sharp Jaw Contours & Shading -->
      <path d="M 120 290 Q 140 330 170 345" stroke="%23AF7D61" stroke-width="2" stroke-opacity="0.3" fill="none"/>
      <path d="M 280 290 Q 260 330 230 345" stroke="%23AF7D61" stroke-width="2" stroke-opacity="0.3" fill="none"/>
      <!-- Lips -->
      <path d="M 178 312 Q 200 308 222 312 Q 200 326 178 312 Z" fill="%23BF6255"/>
      <!-- Hair Top -->
      <path d="M 105 185 C 105 105 145 85 200 85 C 255 85 295 105 295 185 C 285 145 255 138 200 138 C 145 138 115 145 105 185 Z" fill="url(%23hair-sq)"/>
    </svg>`,
  },
];
