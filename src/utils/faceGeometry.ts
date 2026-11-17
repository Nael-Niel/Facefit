// src/utils/faceGeometry.ts

import { FaceShapeType } from '@/data/eyewearData';

export interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
}

export interface FaceMetrics {
  // Pixel distances
  faceHeight: number;       // Landmark 10 to 152 (P)
  foreheadWidth: number;    // Landmark 103 to 332 (L_dahi)
  cheekboneWidth: number;   // Landmark 234 to 454 (L_pipi)
  jawWidth: number;         // Landmark 172 to 397 (L_rahang)

  // Geometric Ratios
  lengthToWidthRatio: number;    // P / L_pipi
  jawToCheekRatio: number;       // L_rahang / L_pipi
  foreheadToCheekRatio: number;  // L_dahi / L_pipi
  foreheadToJawRatio: number;    // L_dahi / L_rahang

  // Coordinate reference points for Try-On & Face Mesh
  points: {
    foreheadTop: { x: number; y: number };     // 10
    chinBottom: { x: number; y: number };      // 152
    templeLeft: { x: number; y: number };      // 103
    templeRight: { x: number; y: number };     // 332
    cheekLeft: { x: number; y: number };       // 234
    cheekRight: { x: number; y: number };      // 454
    jawLeft: { x: number; y: number };         // 172
    jawRight: { x: number; y: number };        // 397
    eyeLeftOuter: { x: number; y: number };    // 33
    eyeRightOuter: { x: number; y: number };   // 263
    noseBridge: { x: number; y: number };      // 168
  };

  // Image dimensions
  imageWidth: number;
  imageHeight: number;
}

export interface ClassificationResult {
  shape: FaceShapeType;
  confidence: number; // 78% - 96%
  primaryRuleMatched: string;
  ratios: {
    lengthToWidth: number;
    jawToCheek: number;
    foreheadToCheek: number;
    foreheadToJaw: number;
  };
  metrics: FaceMetrics;
  allCandidates: Array<{
    shape: FaceShapeType;
    score: number;
    confidence: number;
  }>;
}

// MediaPipe Landmark Index Constants
export const LANDMARK_INDEX = {
  FOREHEAD_TOP: 10,
  CHIN_BOTTOM: 152,
  TEMPLE_LEFT: 103,
  TEMPLE_RIGHT: 332,
  CHEEK_LEFT: 234,
  CHEEK_RIGHT: 454,
  JAW_LEFT: 172,
  JAW_RIGHT: 397,
  EYE_LEFT_OUTER: 33,
  EYE_RIGHT_OUTER: 263,
  NOSE_BRIDGE: 168,
} as const;

/**
 * Rumus Jarak Euclidean:
 * d(A, B) = sqrt((x_B - x_A)^2 + (y_B - y_A)^2)
 */
export function calculateEuclideanDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Ekstraksi koordinat piksel dan metrik rasio geometri dari MediaPipe Landmarks
 */
export function extractFaceMetrics(
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
): FaceMetrics {
  const getPixelCoord = (idx: number) => {
    const lm = landmarks[idx];
    if (!lm) {
      throw new Error(`Landmark index ${idx} tidak ditemukan.`);
    }
    return {
      x: lm.x * width,
      y: lm.y * height,
    };
  };

  const foreheadTop = getPixelCoord(LANDMARK_INDEX.FOREHEAD_TOP);
  const chinBottom = getPixelCoord(LANDMARK_INDEX.CHIN_BOTTOM);
  const templeLeft = getPixelCoord(LANDMARK_INDEX.TEMPLE_LEFT);
  const templeRight = getPixelCoord(LANDMARK_INDEX.TEMPLE_RIGHT);
  const cheekLeft = getPixelCoord(LANDMARK_INDEX.CHEEK_LEFT);
  const cheekRight = getPixelCoord(LANDMARK_INDEX.CHEEK_RIGHT);
  const jawLeft = getPixelCoord(LANDMARK_INDEX.JAW_LEFT);
  const jawRight = getPixelCoord(LANDMARK_INDEX.JAW_RIGHT);
  const eyeLeftOuter = getPixelCoord(LANDMARK_INDEX.EYE_LEFT_OUTER);
  const eyeRightOuter = getPixelCoord(LANDMARK_INDEX.EYE_RIGHT_OUTER);
  const noseBridge = getPixelCoord(LANDMARK_INDEX.NOSE_BRIDGE);

  const faceHeight = calculateEuclideanDistance(foreheadTop, chinBottom);
  const foreheadWidth = calculateEuclideanDistance(templeLeft, templeRight);
  const cheekboneWidth = calculateEuclideanDistance(cheekLeft, cheekRight);
  const jawWidth = calculateEuclideanDistance(jawLeft, jawRight);

  // Mencegah pembagian dengan nol
  const safeCheekWidth = cheekboneWidth > 0 ? cheekboneWidth : 1;
  const safeJawWidth = jawWidth > 0 ? jawWidth : 1;

  const lengthToWidthRatio = faceHeight / safeCheekWidth;
  const jawToCheekRatio = jawWidth / safeCheekWidth;
  const foreheadToCheekRatio = foreheadWidth / safeCheekWidth;
  const foreheadToJawRatio = foreheadWidth / safeJawWidth;

  return {
    faceHeight,
    foreheadWidth,
    cheekboneWidth,
    jawWidth,
    lengthToWidthRatio,
    jawToCheekRatio,
    foreheadToCheekRatio,
    foreheadToJawRatio,
    points: {
      foreheadTop,
      chinBottom,
      templeLeft,
      templeRight,
      cheekLeft,
      cheekRight,
      jawLeft,
      jawRight,
      eyeLeftOuter,
      eyeRightOuter,
      noseBridge,
    },
    imageWidth: width,
    imageHeight: height,
  };
}

/**
 * Centroid / nilai rasio ideal untuk masing-masing bentuk wajah
 * Digunakan untuk menghitung confidence score dan boundary distance
 */
interface ShapeCentroid {
  shape: FaceShapeType;
  ideal: {
    lengthToWidthRatio: number;
    jawToCheekRatio: number;
    foreheadToCheekRatio: number;
    foreheadToJawRatio: number;
  };
  weights: {
    lengthToWidth: number;
    jawToCheek: number;
    foreheadToCheek: number;
    foreheadToJaw: number;
  };
}

const SHAPE_CENTROIDS: ShapeCentroid[] = [
  {
    shape: 'Oval',
    ideal: {
      lengthToWidthRatio: 1.38,
      jawToCheekRatio: 0.82,
      foreheadToCheekRatio: 0.84,
      foreheadToJawRatio: 1.02,
    },
    weights: { lengthToWidth: 1.2, jawToCheek: 1.0, foreheadToCheek: 0.8, foreheadToJaw: 0.8 },
  },
  {
    shape: 'Round',
    ideal: {
      lengthToWidthRatio: 1.12,
      jawToCheekRatio: 0.84,
      foreheadToCheekRatio: 0.83,
      foreheadToJawRatio: 0.99,
    },
    weights: { lengthToWidth: 1.4, jawToCheek: 1.1, foreheadToCheek: 0.7, foreheadToJaw: 0.7 },
  },
  {
    shape: 'Square',
    ideal: {
      lengthToWidthRatio: 1.18,
      jawToCheekRatio: 0.94,
      foreheadToCheekRatio: 0.91,
      foreheadToJawRatio: 0.97,
    },
    weights: { lengthToWidth: 1.1, jawToCheek: 1.4, foreheadToCheek: 0.8, foreheadToJaw: 0.8 },
  },
  {
    shape: 'Heart',
    ideal: {
      lengthToWidthRatio: 1.30,
      jawToCheekRatio: 0.73,
      foreheadToCheekRatio: 0.92,
      foreheadToJawRatio: 1.26,
    },
    weights: { lengthToWidth: 0.9, jawToCheek: 1.2, foreheadToCheek: 0.9, foreheadToJaw: 1.4 },
  },
  {
    shape: 'Diamond',
    ideal: {
      lengthToWidthRatio: 1.36,
      jawToCheekRatio: 0.72,
      foreheadToCheekRatio: 0.74,
      foreheadToJawRatio: 1.03,
    },
    weights: { lengthToWidth: 0.9, jawToCheek: 1.3, foreheadToCheek: 1.4, foreheadToJaw: 0.8 },
  },
  {
    shape: 'Triangle',
    ideal: {
      lengthToWidthRatio: 1.24,
      jawToCheekRatio: 0.96,
      foreheadToCheekRatio: 0.77,
      foreheadToJawRatio: 0.80,
    },
    weights: { lengthToWidth: 0.9, jawToCheek: 1.4, foreheadToCheek: 0.9, foreheadToJaw: 1.4 },
  },
];

/**
 * Heuristic Classifier sesuai Bagian 4.C FACEFIT_AGENT_SPEC.md:
 * 1. Diamond Face: foreheadToCheekRatio < 0.82 && jawToCheekRatio < 0.80
 * 2. Heart Face: foreheadToJawRatio > 1.15 && jawToCheekRatio < 0.83
 * 3. Triangle Face: foreheadToJawRatio < 0.88 && jawToCheekRatio > 0.92
 * 4. Round Face: lengthToWidthRatio < 1.22 && jawToCheekRatio >= 0.80 && jawToCheekRatio <= 0.90
 * 5. Square Face: jawToCheekRatio >= 0.90 && lengthToWidthRatio < 1.30
 * 6. Oval Face: lengthToWidthRatio >= 1.25 && jawToCheekRatio < 0.90
 */
export function classifyFaceShape(metrics: FaceMetrics): ClassificationResult {
  const {
    lengthToWidthRatio,
    jawToCheekRatio,
    foreheadToCheekRatio,
    foreheadToJawRatio,
  } = metrics;

  // Evaluasi kecocokan aturan eksplisit spesifikasi
  const ruleMatches: Array<{ shape: FaceShapeType; rule: string; priority: number }> = [];

  // 1. Diamond Face
  if (foreheadToCheekRatio < 0.82 && jawToCheekRatio < 0.80) {
    ruleMatches.push({
      shape: 'Diamond',
      rule: 'Pipi signifikan lebih lebar dari dahi (<0.82) dan rahang (<0.80)',
      priority: 10,
    });
  }

  // 2. Heart Face
  if (foreheadToJawRatio > 1.15 && jawToCheekRatio < 0.83) {
    ruleMatches.push({
      shape: 'Heart',
      rule: 'Dahi lebar terhadap rahang (>1.15) dan dagu menyempit (<0.83)',
      priority: 9,
    });
  }

  // 3. Triangle Face
  if (foreheadToJawRatio < 0.88 && jawToCheekRatio > 0.92) {
    ruleMatches.push({
      shape: 'Triangle',
      rule: 'Rahang lebih lebar dari dahi (<0.88) dan rahang dominan (>0.92)',
      priority: 8,
    });
  }

  // 4. Round Face
  if (lengthToWidthRatio < 1.22 && jawToCheekRatio >= 0.80 && jawToCheekRatio <= 0.90) {
    ruleMatches.push({
      shape: 'Round',
      rule: 'Panjang & lebar seimbang (<1.22) dengan lekuk rahang lembut (0.80-0.90)',
      priority: 7,
    });
  }

  // 5. Square Face
  if (jawToCheekRatio >= 0.90 && lengthToWidthRatio < 1.30) {
    ruleMatches.push({
      shape: 'Square',
      rule: 'Lebar dahi, pipi, dan rahang sejajar (rahang/pipi >=0.90, rasio <1.30)',
      priority: 6,
    });
  }

  // 6. Oval Face
  if (lengthToWidthRatio >= 1.25 && jawToCheekRatio < 0.90) {
    ruleMatches.push({
      shape: 'Oval',
      rule: 'Proporsional dengan panjang wajah dominan (>=1.25) & rahang proporsional (<0.90)',
      priority: 5,
    });
  }

  // Hitung jarak berbobot ke setiap centroid untuk menghitung skor confidence (78% - 96%)
  const candidateScores = SHAPE_CENTROIDS.map((c) => {
    const dLw = Math.abs(lengthToWidthRatio - c.ideal.lengthToWidthRatio) * c.weights.lengthToWidth;
    const dJc = Math.abs(jawToCheekRatio - c.ideal.jawToCheekRatio) * c.weights.jawToCheek;
    const dFc = Math.abs(foreheadToCheekRatio - c.ideal.foreheadToCheekRatio) * c.weights.foreheadToCheek;
    const dFj = Math.abs(foreheadToJawRatio - c.ideal.foreheadToJawRatio) * c.weights.foreheadToJaw;

    const weightedDistance = Math.sqrt(dLw * dLw + dJc * dJc + dFc * dFc + dFj * dFj);

    // Konversi jarak ke skor confidence antara 78% hingga 96%
    // Semakin kecil jarak ke ideal, semakin mendekati 96%
    const normalizedCloseness = Math.max(0, Math.min(1, 1 - weightedDistance / 0.55));
    const confidence = parseFloat((78 + normalizedCloseness * 18).toFixed(1));

    return {
      shape: c.shape,
      score: weightedDistance,
      confidence,
    };
  });

  // Urutkan kandidat dari jarak terkecil (skor terbagus)
  candidateScores.sort((a, b) => a.score - b.score);

  let selectedShape: FaceShapeType;
  let primaryRule = '';

  if (ruleMatches.length > 0) {
    // Jika ada rule yang cocok, pilih yang memiliki kecocokan centroid terbaik di antara yang cocok
    const matchingShapes = new Set(ruleMatches.map((r) => r.shape));
    const bestMatchingCandidate = candidateScores.find((c) => matchingShapes.has(c.shape));

    if (bestMatchingCandidate) {
      selectedShape = bestMatchingCandidate.shape;
      const matched = ruleMatches.find((r) => r.shape === selectedShape);
      primaryRule = matched ? matched.rule : 'Heuristic geometric matching';
    } else {
      selectedShape = ruleMatches[0].shape;
      primaryRule = ruleMatches[0].rule;
    }
  } else {
    // Fallback: gunakan kandidat dengan jarak terdekat ke nilai centroid
    selectedShape = candidateScores[0].shape;
    primaryRule = `Pola geometris paling mendekati standar ${selectedShape}`;
  }

  // Cari skor confidence untuk bentuk wajah terpilih
  const selectedCandidate = candidateScores.find((c) => c.shape === selectedShape) || candidateScores[0];
  let finalConfidence = selectedCandidate.confidence;

  // Jika cocok sempurna dengan aturan heuristik spesifikasi, beri bonus confidence ringan dalam batas 96%
  if (ruleMatches.some((r) => r.shape === selectedShape)) {
    finalConfidence = Math.min(96.0, parseFloat((finalConfidence + 2.5).toFixed(1)));
  }

  return {
    shape: selectedShape,
    confidence: finalConfidence,
    primaryRuleMatched: primaryRule,
    ratios: {
      lengthToWidth: parseFloat(lengthToWidthRatio.toFixed(2)),
      jawToCheek: parseFloat(jawToCheekRatio.toFixed(2)),
      foreheadToCheek: parseFloat(foreheadToCheekRatio.toFixed(2)),
      foreheadToJaw: parseFloat(foreheadToJawRatio.toFixed(2)),
    },
    metrics,
    allCandidates: candidateScores,
  };
}

/**
 * Singleton Loader untuk MediaPipe Face Landmarker
 * Menggunakan CDN model resmi dari Google MediaPipe
 */
let cachedLandmarker: any = null;
let landmarkerLoadingPromise: Promise<any> | null = null;

export async function getFaceLandmarker() {
  if (cachedLandmarker) {
    return cachedLandmarker;
  }

  if (landmarkerLoadingPromise) {
    return landmarkerLoadingPromise;
  }

  landmarkerLoadingPromise = (async () => {
    // Dynamic import to prevent SSR issues in Next.js
    const vision = await import('@mediapipe/tasks-vision');
    const { FaceLandmarker, FilesetResolver } = vision;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
    );

    let landmarker;
    try {
      landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        outputFaceBlendshapes: false,
        runningMode: 'IMAGE',
        numFaces: 2, // deteksi jika ada lebih dari 1 wajah
      });
    } catch (gpuError) {
      console.warn('MediaPipe GPU delegate gagal, beralih ke CPU delegate:', gpuError);
      landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'CPU',
        },
        outputFaceBlendshapes: false,
        runningMode: 'IMAGE',
        numFaces: 2,
      });
    }

    cachedLandmarker = landmarker;
    return landmarker;
  })();

  return landmarkerLoadingPromise;
}
