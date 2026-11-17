// src/data/eyewearData.ts

export type FaceShapeType = 'Oval' | 'Round' | 'Square' | 'Triangle' | 'Heart' | 'Diamond';

export type SuitabilityLevel = 'Very Suitable' | 'Suitable' | 'Moderately Suitable' | 'Not Suitable';

export interface EyewearModel {
  id: string;
  name: string;
  category: 'Cat-eye' | 'Square' | 'Aviator' | 'Round' | 'Oval';
  subtitle: string;
  description: string;
  colorName: string;
  frameWidth: number; // reference SVG width
  frameHeight: number; // reference SVG height
  bridgeOffsetRatio: number; // Y offset factor relative to bridge
  svgString: string;
}

export const FACE_SHAPE_INFO: Record<FaceShapeType, {
  name: string;
  tagline: string;
  description: string;
  characteristics: string[];
  stylingAdvice: string;
}> = {
  Oval: {
    name: 'Oval Face',
    tagline: 'Bentuk Wajah Seimbang & Serbaguna',
    description: 'Proporsi wajah paling seimbang dengan tulang pipi yang sedikit lebih lebar dari dahi dan rahang yang meruncing lembut.',
    characteristics: [
      'Panjang wajah kira-kira 1.3 - 1.5 kali lebarnya',
      'Garis rahang melengkung lembut tanpa sudut kaku',
      'Proporsi dahi dan rahang seimbang harmonis'
    ],
    stylingAdvice: 'Hampir semua model bingkai cocok untuk Anda! Pilih frame geometris atau cat-eye untuk mempertahankan keseimbangan alami wajah.'
  },
  Round: {
    name: 'Round Face',
    tagline: 'Bentuk Wajah Lembut & Melingkar',
    description: 'Panjang dan lebar wajah hampir sama dengan lekukan rahang yang halus dan pipi yang cenderung penuh.',
    characteristics: [
      'Panjang dan lebar wajah hampir seimbang (rasio ~1.0 - 1.2)',
      'Tulang pipi merupakan bagian terlebar dari wajah',
      'Sudut rahang melengkung lembut tanpa garis tegas'
    ],
    stylingAdvice: 'Pilih frame bersudut tegas seperti Square atau Cat-eye untuk memberi dimensi, ilusi struktur, dan memperpanjang siluet wajah.'
  },
  Square: {
    name: 'Square Face',
    tagline: 'Bentuk Wajah Tegas & Berkarakter',
    description: 'Garis rahang kuat dan dahi yang lebar dengan proporsi lebar dahi, pipi, dan rahang yang relatif sejajar.',
    characteristics: [
      'Lebar dahi, tulang pipi, dan rahang hampir sama',
      'Garis rahang bersudut tajam dan tegas',
      'Rasio panjang terhadap lebar cenderung proporsional dan kokoh'
    ],
    stylingAdvice: 'Frame melengkung seperti Round dan Oval sangat ideal untuk melembutkan sudut tajam rahang dan menyeimbangkan siluet wajah.'
  },
  Triangle: {
    name: 'Triangle Face',
    tagline: 'Bentuk Wajah Rahang Dominan',
    description: 'Garis rahang lebih lebar dan dominan dibandingkan dahi yang relatif menyempit.',
    characteristics: [
      'Lebar rahang secara signifikan melebihi lebar dahi',
      'Dahi cenderung sempit atau meruncing ke atas',
      'Garis rahang tegas dan kokoh di bagian bawah'
    ],
    stylingAdvice: 'Pilih bingkai yang memberi volume pada area dahi seperti Cat-eye atau Aviator dengan detail atas yang kuat untuk menyeimbangkan rahang.'
  },
  Heart: {
    name: 'Heart Face',
    tagline: 'Bentuk Wajah Dahi Lebar & Dagu Runcing',
    description: 'Dahi dan pelipis lebih lebar dengan dagu yang meruncing tajam ke bawah menyerupai siluet hati.',
    characteristics: [
      'Dahi lebar dan tulang pipi tinggi',
      'Garis rahang menyempit drastis ke arah dagu',
      'Dagu cenderung lancip atau berkarakter V-line'
    ],
    stylingAdvice: 'Frame dengan garis bawah melengkung halus seperti Round, Oval, atau Cat-eye lembut dapat menyeimbangkan dahi lebar dan melembutkan dagu.'
  },
  Diamond: {
    name: 'Diamond Face',
    tagline: 'Bentuk Wajah Tulang Pipi Menonjol & Eksotis',
    description: 'Tulang pipi tinggi dan menonjol, sementara dahi dan garis rahang keduanya menyempit secara simetris.',
    characteristics: [
      'Tulang pipi merupakan bagian paling lebar dan dominan',
      'Dahi dan dagu sama-sama sempit meruncing',
      'Garis wajah memiliki lekuk sudut yang dramatis dan anggun'
    ],
    stylingAdvice: 'Pilih frame dengan siluet melengkung seperti Round dan Oval, atau Cat-eye halus untuk menonjolkan tulang pipi tanpa membuatnya tampak terlalu tajam.'
  }
};

/**
 * Matriks Kecocokan Persis Sesuai Tabel Referensi Penelitian pada Spesifikasi:
 * 
 * | Bentuk Wajah | Cat-eye       | Square              | Aviator             | Round        | Oval                |
 * | :---         | :---          | :---                | :---                | :---         | :---                |
 * | Oval         | Very Suitable | Very Suitable       | Very Suitable       | Not Suitable | Very Suitable       |
 * | Round        | Very Suitable | Very Suitable       | Suitable            | Not Suitable | Moderately Suitable |
 * | Square       | Suitable      | Not Suitable        | Moderately Suitable | Very Suitable| Suitable            |
 * | Triangle     | Very Suitable | Moderately Suitable | Suitable            | Very Suitable| Very Suitable       |
 * | Heart        | Suitable      | Moderately Suitable | Suitable            | Very Suitable| Very Suitable       |
 * | Diamond      | Suitable      | Suitable            | Suitable            | Very Suitable| Very Suitable       |
 */
export const SUITABILITY_MATRIX: Record<FaceShapeType, Record<EyewearModel['category'], SuitabilityLevel>> = {
  Oval: {
    'Cat-eye': 'Very Suitable',
    'Square': 'Very Suitable',
    'Aviator': 'Very Suitable',
    'Round': 'Not Suitable',
    'Oval': 'Very Suitable',
  },
  Round: {
    'Cat-eye': 'Very Suitable',
    'Square': 'Very Suitable',
    'Aviator': 'Suitable',
    'Round': 'Not Suitable',
    'Oval': 'Moderately Suitable',
  },
  Square: {
    'Cat-eye': 'Suitable',
    'Square': 'Not Suitable',
    'Aviator': 'Moderately Suitable',
    'Round': 'Very Suitable',
    'Oval': 'Suitable',
  },
  Triangle: {
    'Cat-eye': 'Very Suitable',
    'Square': 'Moderately Suitable',
    'Aviator': 'Suitable',
    'Round': 'Very Suitable',
    'Oval': 'Very Suitable',
  },
  Heart: {
    'Cat-eye': 'Suitable',
    'Square': 'Moderately Suitable',
    'Aviator': 'Suitable',
    'Round': 'Very Suitable',
    'Oval': 'Very Suitable',
  },
  Diamond: {
    'Cat-eye': 'Suitable',
    'Square': 'Suitable',
    'Aviator': 'Suitable',
    'Round': 'Very Suitable',
    'Oval': 'Very Suitable',
  },
};

export const SUITABILITY_CONFIG: Record<SuitabilityLevel, {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  score: number;
}> = {
  'Very Suitable': {
    label: 'Sangat Cocok',
    badgeBg: 'bg-emerald-50 text-emerald-800',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-300',
    dotColor: 'bg-emerald-500',
    score: 95,
  },
  'Suitable': {
    label: 'Cocok',
    badgeBg: 'bg-blue-50 text-blue-800',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-300',
    dotColor: 'bg-blue-500',
    score: 85,
  },
  'Moderately Suitable': {
    label: 'Cukup Cocok',
    badgeBg: 'bg-amber-50 text-amber-800',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-300',
    dotColor: 'bg-amber-500',
    score: 70,
  },
  'Not Suitable': {
    label: 'Kurang Cocok',
    badgeBg: 'bg-rose-50 text-rose-800',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-300',
    dotColor: 'bg-rose-500',
    score: 45,
  },
};

// 5 SVG Vektor Kacamata yang Realistis & Proporsional
// Standar ViewBox: 0 0 800 320, Nose bridge tengah persis di (400, 160)
export const EYEWEAR_CATALOG: EyewearModel[] = [
  {
    id: 'cateye-lumina',
    category: 'Cat-eye',
    name: 'Lumina Noir Cat-Eye',
    subtitle: 'Chic Upswept Browline',
    description: 'Siluet cat-eye dramatis dengan lekuk sudut atas yang anggun, aksen pin engsel emas, dan gradien lensa amber hangat.',
    colorName: 'Espresso Tortoise & Gold',
    frameWidth: 800,
    frameHeight: 320,
    bridgeOffsetRatio: 0,
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="800" height="320">
  <defs>
    <linearGradient id="cateye-lens" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#362217" stop-opacity="0.65"/>
      <stop offset="60%" stop-color="#543622" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#805333" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="cateye-rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4A2C1D"/>
      <stop offset="35%" stop-color="#7C432B"/>
      <stop offset="65%" stop-color="#3A1E14"/>
      <stop offset="100%" stop-color="#8C5237"/>
    </linearGradient>
    <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#FFF2A1"/>
      <stop offset="100%" stop-color="#AA820A"/>
    </linearGradient>
    <filter id="drop-shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <g filter="url(#drop-shadow)">
    <!-- Bridge -->
    <path d="M 360 162 Q 400 148 440 162 Q 400 156 360 162 Z" fill="url(#gold-metal)" stroke="#8C6810" stroke-width="1.5"/>

    <!-- Left Frame Outer -->
    <path d="M 370 160 C 370 120 330 90 230 85 C 130 80 70 95 40 120 C 35 125 50 165 80 215 C 115 270 200 270 260 250 C 320 230 370 200 370 160 Z"
          fill="url(#cateye-rim)" stroke="#26140D" stroke-width="4" stroke-linejoin="round"/>

    <!-- Right Frame Outer -->
    <path d="M 430 160 C 430 120 470 90 570 85 C 670 80 730 95 760 120 C 765 125 750 165 720 215 C 685 270 600 270 540 250 C 480 230 430 200 430 160 Z"
          fill="url(#cateye-rim)" stroke="#26140D" stroke-width="4" stroke-linejoin="round"/>

    <!-- Left Lens -->
    <path d="M 355 160 C 355 130 320 106 230 102 C 145 98 90 110 65 130 C 75 168 100 210 130 238 C 175 258 245 252 285 235 C 325 218 355 190 355 160 Z"
          fill="url(#cateye-lens)" stroke="#FFF2A1" stroke-width="1" stroke-opacity="0.3"/>

    <!-- Right Lens -->
    <path d="M 445 160 C 445 130 480 106 570 102 C 655 98 710 110 735 130 C 725 168 700 210 670 238 C 625 258 555 252 515 235 C 475 218 445 190 445 160 Z"
          fill="url(#cateye-lens)" stroke="#FFF2A1" stroke-width="1" stroke-opacity="0.3"/>

    <!-- Specular Reflection Highlight (Left) -->
    <path d="M 90 125 Q 160 108 240 108" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.5" fill="none"/>
    <!-- Specular Reflection Highlight (Right) -->
    <path d="M 560 108 Q 640 108 710 125" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.5" fill="none"/>

    <!-- Temple Pin Accents (Gold rivets) -->
    <circle cx="56" cy="115" r="3.5" fill="url(#gold-metal)"/>
    <circle cx="68" cy="113" r="2.5" fill="url(#gold-metal)"/>
    <circle cx="744" cy="115" r="3.5" fill="url(#gold-metal)"/>
    <circle cx="732" cy="113" r="2.5" fill="url(#gold-metal)"/>
  </g>
</svg>`
  },
  {
    id: 'square-vanguard',
    category: 'Square',
    name: 'Vanguard Acetate Square',
    subtitle: 'Bold Architectural Frame',
    description: 'Frame persegi berdimensi tegas dengan garis lurus modern, sudut berkarakter maskulin-elegan, dan lensa anti-reflektif charcoal.',
    colorName: 'Charcoal Black & Gunmetal',
    frameWidth: 800,
    frameHeight: 320,
    bridgeOffsetRatio: 0,
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="800" height="320">
  <defs>
    <linearGradient id="sq-rim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D2D2D"/>
      <stop offset="50%" stop-color="#1A1A1A"/>
      <stop offset="100%" stop-color="#0E0E0E"/>
    </linearGradient>
    <linearGradient id="sq-lens" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1B2631" stop-opacity="0.6"/>
      <stop offset="70%" stop-color="#2C3E50" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#4B6584" stop-opacity="0.25"/>
    </linearGradient>
    <linearGradient id="silver-metal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#95A5A6"/>
      <stop offset="50%" stop-color="#EAEDED"/>
      <stop offset="100%" stop-color="#7F8C8D"/>
    </linearGradient>
    <filter id="sq-shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
  </defs>

  <g filter="url(#sq-shadow)">
    <!-- Bridge -->
    <path d="M 360 148 Q 400 138 440 148 L 440 162 Q 400 152 360 162 Z" fill="url(#sq-rim)" stroke="#111" stroke-width="1"/>

    <!-- Left Frame Outer -->
    <rect x="70" y="85" width="295" height="175" rx="28" ry="28"
          fill="url(#sq-rim)" stroke="#0A0A0A" stroke-width="4"/>

    <!-- Right Frame Outer -->
    <rect x="435" y="85" width="295" height="175" rx="28" ry="28"
          fill="url(#sq-rim)" stroke="#0A0A0A" stroke-width="4"/>

    <!-- Left Lens -->
    <rect x="92" y="105" width="250" height="135" rx="16" ry="16"
          fill="url(#sq-lens)" stroke="#A0B2C6" stroke-width="1.2" stroke-opacity="0.4"/>

    <!-- Right Lens -->
    <rect x="458" y="105" width="250" height="135" rx="16" ry="16"
          fill="url(#sq-lens)" stroke="#A0B2C6" stroke-width="1.2" stroke-opacity="0.4"/>

    <!-- Diagonal Glass Glare Reflection (Left) -->
    <polygon points="120,107 190,107 110,238 94,238" fill="#FFFFFF" fill-opacity="0.12"/>
    <polygon points="205,107 235,107 140,238 122,238" fill="#FFFFFF" fill-opacity="0.08"/>

    <!-- Diagonal Glass Glare Reflection (Right) -->
    <polygon points="485,107 555,107 475,238 460,238" fill="#FFFFFF" fill-opacity="0.12"/>
    <polygon points="570,107 600,107 505,238 488,238" fill="#FFFFFF" fill-opacity="0.08"/>

    <!-- Silver Rivets on corners -->
    <rect x="80" y="98" width="6" height="3" rx="1" fill="url(#silver-metal)"/>
    <rect x="80" y="105" width="6" height="3" rx="1" fill="url(#silver-metal)"/>
    <rect x="714" y="98" width="6" height="3" rx="1" fill="url(#silver-metal)"/>
    <rect x="714" y="105" width="6" height="3" rx="1" fill="url(#silver-metal)"/>
  </g>
</svg>`
  },
  {
    id: 'aviator-classic',
    category: 'Aviator',
    name: 'Aero Gold Double-Bridge Aviator',
    subtitle: 'Timeless Teardrop Silhouette',
    description: 'Desain legendaris pilot dengan double-bridge kawat baja ringan berwarna emas, lensa teardrop klasik, dan siluet ikonik yang tak lekang oleh waktu.',
    colorName: 'Polished Gold & Forest Green',
    frameWidth: 800,
    frameHeight: 320,
    bridgeOffsetRatio: 0,
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="800" height="320">
  <defs>
    <linearGradient id="av-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C158"/>
      <stop offset="50%" stop-color="#FFF4B8"/>
      <stop offset="100%" stop-color="#9C7924"/>
    </linearGradient>
    <linearGradient id="av-lens" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D3A29" stop-opacity="0.65"/>
      <stop offset="50%" stop-color="#3D5037" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#556E4D" stop-opacity="0.3"/>
    </linearGradient>
    <filter id="av-shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <g filter="url(#av-shadow)">
    <!-- Top Brow Bar -->
    <path d="M 330 115 L 470 115" stroke="url(#av-gold)" stroke-width="4.5" stroke-linecap="round"/>

    <!-- Curved Lower Bridge -->
    <path d="M 358 152 Q 400 138 442 152" fill="none" stroke="url(#av-gold)" stroke-width="4.5" stroke-linecap="round"/>

    <!-- Left Rim & Lens -->
    <!-- Teardrop path -->
    <path d="M 360 145 C 360 112 320 105 225 105 C 130 105 85 125 78 165 C 70 215 125 272 205 272 C 295 272 360 218 360 145 Z"
          fill="url(#av-lens)" stroke="url(#av-gold)" stroke-width="6"/>

    <!-- Right Rim & Lens -->
    <path d="M 440 145 C 440 112 480 105 575 105 C 670 105 715 125 722 165 C 730 215 675 272 595 272 C 505 272 440 218 440 145 Z"
          fill="url(#av-lens)" stroke="url(#av-gold)" stroke-width="6"/>

    <!-- Highlights -->
    <path d="M 120 128 C 170 115 240 115 295 122" stroke="#FFFFFF" stroke-width="2.5" stroke-opacity="0.45" stroke-linecap="round" fill="none"/>
    <path d="M 505 122 C 560 115 630 115 680 128" stroke="#FFFFFF" stroke-width="2.5" stroke-opacity="0.45" stroke-linecap="round" fill="none"/>

    <!-- Nose Pad Stems -->
    <path d="M 372 175 Q 380 185 378 198" stroke="url(#av-gold)" stroke-width="2.5" fill="none"/>
    <ellipse cx="380" cy="198" rx="4" ry="7" fill="#F8F9F9" fill-opacity="0.8" stroke="#D4AF37" stroke-width="1"/>
    <path d="M 428 175 Q 420 185 422 198" stroke="url(#av-gold)" stroke-width="2.5" fill="none"/>
    <ellipse cx="420" cy="198" rx="4" ry="7" fill="#F8F9F9" fill-opacity="0.8" stroke="#D4AF37" stroke-width="1"/>

    <!-- Outer Hinge Connectors -->
    <rect x="68" y="145" width="10" height="6" rx="2" fill="url(#av-gold)"/>
    <rect x="722" y="145" width="10" height="6" rx="2" fill="url(#av-gold)"/>
  </g>
</svg>`
  },
  {
    id: 'round-intellect',
    category: 'Round',
    name: 'Artisan Circular Round',
    subtitle: 'Vintage Parisian Silhouette',
    description: 'Bentuk bulat simetris klasik dengan sentuhan gaya intelektual Eropa, jembatan lengkung antik, dan lensa sepia hangat.',
    colorName: 'Vintage Amber Tortoise',
    frameWidth: 800,
    frameHeight: 320,
    bridgeOffsetRatio: 0,
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="800" height="320">
  <defs>
    <linearGradient id="rd-rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4E2E1E"/>
      <stop offset="50%" stop-color="#7C432B"/>
      <stop offset="100%" stop-color="#2D170D"/>
    </linearGradient>
    <linearGradient id="rd-lens" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C231E" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="#4A3B33" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#6E584C" stop-opacity="0.25"/>
    </linearGradient>
    <filter id="rd-shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <g filter="url(#rd-shadow)">
    <!-- Keyhole Arch Bridge -->
    <path d="M 355 165 C 355 138 380 132 400 132 C 420 132 445 138 445 165 C 435 158 418 152 400 152 C 382 152 365 158 355 165 Z"
          fill="url(#rd-rim)" stroke="#1F1009" stroke-width="2"/>

    <!-- Left Frame & Lens -->
    <circle cx="230" cy="170" r="102" fill="url(#rd-rim)" stroke="#1F1009" stroke-width="4"/>
    <circle cx="230" cy="170" r="86" fill="url(#rd-lens)" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.4"/>

    <!-- Right Frame & Lens -->
    <circle cx="570" cy="170" r="102" fill="url(#rd-rim)" stroke="#1F1009" stroke-width="4"/>
    <circle cx="570" cy="170" r="86" fill="url(#rd-lens)" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.4"/>

    <!-- Curved Arc Glare Highlight (Left) -->
    <path d="M 165 130 A 75 75 0 0 1 270 108" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.45"/>
    <!-- Curved Arc Glare Highlight (Right) -->
    <path d="M 505 130 A 75 75 0 0 1 610 108" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.45"/>

    <!-- Temple Extension Tabs -->
    <path d="M 128 165 L 102 165 C 98 165 96 172 100 175 L 128 175 Z" fill="url(#rd-rim)"/>
    <circle cx="112" cy="170" r="2.5" fill="#D4AF37"/>
    <path d="M 672 165 L 698 165 C 702 165 704 172 700 175 L 672 175 Z" fill="url(#rd-rim)"/>
    <circle cx="688" cy="170" r="2.5" fill="#D4AF37"/>
  </g>
</svg>`
  },
  {
    id: 'oval-harmony',
    category: 'Oval',
    name: 'Harmony Sleek Minimalist Oval',
    subtitle: 'Streamlined Contemporary Oval',
    description: 'Siluet oval ramping yang memadukan keanggunan modern dan gaya retro 90-an, memberikan proporsi lembut yang menyatu dengan kontur wajah.',
    colorName: 'Polished Olive & Bronze',
    frameWidth: 800,
    frameHeight: 320,
    bridgeOffsetRatio: 0,
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="800" height="320">
  <defs>
    <linearGradient id="ov-rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4B5842"/>
      <stop offset="50%" stop-color="#6B7F5E"/>
      <stop offset="100%" stop-color="#313B2B"/>
    </linearGradient>
    <linearGradient id="ov-lens" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#283025" stop-opacity="0.55"/>
      <stop offset="70%" stop-color="#3B4637" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#55644F" stop-opacity="0.22"/>
    </linearGradient>
    <filter id="ov-shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <g filter="url(#ov-shadow)">
    <!-- Bridge -->
    <path d="M 358 158 Q 400 146 442 158 L 442 168 Q 400 156 358 168 Z" fill="url(#ov-rim)" stroke="#22291E" stroke-width="1.5"/>

    <!-- Left Frame Outer -->
    <ellipse cx="230" cy="165" rx="135" ry="78" fill="url(#ov-rim)" stroke="#20271C" stroke-width="4"/>
    <!-- Left Lens -->
    <ellipse cx="230" cy="165" rx="118" ry="63" fill="url(#ov-lens)" stroke="#A3B899" stroke-width="1" stroke-opacity="0.35"/>

    <!-- Right Frame Outer -->
    <ellipse cx="570" cy="165" rx="135" ry="78" fill="url(#ov-rim)" stroke="#20271C" stroke-width="4"/>
    <!-- Right Lens -->
    <ellipse cx="570" cy="165" rx="118" ry="63" fill="url(#ov-lens)" stroke="#A3B899" stroke-width="1" stroke-opacity="0.35"/>

    <!-- Elliptical Soft Highlight (Left) -->
    <path d="M 140 140 Q 230 115 305 132" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-opacity="0.45"/>
    <!-- Elliptical Soft Highlight (Right) -->
    <path d="M 480 140 Q 570 115 645 132" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-opacity="0.45"/>

    <!-- Outer Hinge Rivets -->
    <circle cx="95" cy="165" r="3" fill="#D4AF37"/>
    <circle cx="705" cy="165" r="3" fill="#D4AF37"/>
  </g>
</svg>`
  }
];
