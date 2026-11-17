// src/components/FaceAnalyzer.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Camera,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Sliders,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Timer,
  X,
  Check,
} from 'lucide-react';
import {
  ClassificationResult,
  FaceMetrics,
  classifyFaceShape,
  extractFaceMetrics,
  getFaceLandmarker,
} from '@/utils/faceGeometry';
import {
  renderTryOnCanvas,
  downloadCanvasAsPng,
} from '@/utils/canvasRenderer';
import {
  EyewearModel,
  EYEWEAR_CATALOG,
  SUITABILITY_MATRIX,
} from '@/data/eyewearData';
import { SAMPLE_PHOTOS, SampleFace } from '@/data/samplePhotos';

interface FaceAnalyzerProps {
  onAnalysisComplete: (result: ClassificationResult, defaultEyewear: EyewearModel) => void;
  onReset?: () => void;
  selectedEyewear: EyewearModel | null;
  onSelectEyewear: (eyewear: EyewearModel) => void;
}

export const FaceAnalyzer: React.FC<FaceAnalyzerProps> = ({
  onAnalysisComplete,
  onReset,
  selectedEyewear,
  onSelectEyewear,
}) => {
  // Application State
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Source Media State
  const [imageSource, setImageSource] = useState<HTMLImageElement | null>(null);
  const [imageSrcUrl, setImageSrcUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);

  // Analysis & Render State
  const [currentMetrics, setCurrentMetrics] = useState<FaceMetrics | null>(null);
  const [showFaceMesh, setShowFaceMesh] = useState<boolean>(false);
  const [scaleAdjustment, setScaleAdjustment] = useState<number>(1.0);
  const [offsetYAdjustment, setOffsetYAdjustment] = useState<number>(0);
  const [showFineTune, setShowFineTune] = useState<boolean>(false);

  // DOM Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Redraw canvas whenever eyewear, mesh toggle, or fine-tuning sliders change
  const triggerCanvasRender = useCallback(() => {
    if (!canvasRef.current || !imageSource) return;

    renderTryOnCanvas({
      canvas: canvasRef.current,
      sourceImage: imageSource,
      metrics: currentMetrics,
      selectedEyewear,
      showFaceMesh,
      scaleAdjustment,
      offsetYAdjustment,
    });
  }, [imageSource, currentMetrics, selectedEyewear, showFaceMesh, scaleAdjustment, offsetYAdjustment]);

  useEffect(() => {
    triggerCanvasRender();
  }, [triggerCanvasRender]);

  // Window Resize
  useEffect(() => {
    const handleResize = () => triggerCanvasRender();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [triggerCanvasRender]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Callback ref untuk elemen video agar stream langsung terpasang begitu video di-mount
  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().catch((err) => {
        console.warn('Gagal memutar video otomatis:', err);
      });
    }
  }, []);

  // Pastikan stream terpasang ketika isCameraActive bernilai true
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.warn('Gagal memutar video otomatis:', err);
      });
    }
  }, [isCameraActive]);

  /**
   * Ekstraksi dan Analisis Landmark Wajah menggunakan MediaPipe
   */
  const processImageForLandmarks = async (
    imgElement: HTMLImageElement,
    fallbackHint?: SampleFace
  ) => {
    setAnalyzing(true);
    setErrorMessage(null);
    setAnalysisProgress('Menginisialisasi MediaPipe AI...');

    try {
      setAnalysisProgress('Memindai 478 titik landmark wajah...');
      const landmarker = await getFaceLandmarker();

      // Jalankan deteksi MediaPipe pada elemen gambar
      const detectionResult = landmarker.detect(imgElement);

      if (!detectionResult.faceLandmarks || detectionResult.faceLandmarks.length === 0) {
        if (fallbackHint) {
          useSyntheticFallbackAnalysis(imgElement, fallbackHint);
          return;
        }

        throw new Error(
          'Tidak ada wajah yang terdeteksi. Pastikan wajah Anda menghadap lurus ke depan, memiliki pencahayaan cukup, dan tidak tertutup kacamata/masker.'
        );
      }

      // Deteksi lebih dari 1 wajah
      if (detectionResult.faceLandmarks.length > 1) {
        throw new Error(
          'Terdeteksi lebih dari satu wajah. Harap gunakan foto yang hanya memuat 1 wajah pengguna agar hasil pengukuran akurat.'
        );
      }

      setAnalysisProgress('Menghitung rasio geometri & bentuk wajah...');
      const rawLandmarks = detectionResult.faceLandmarks[0];
      const metrics = extractFaceMetrics(
        rawLandmarks,
        imgElement.naturalWidth || 800,
        imgElement.naturalHeight || 800
      );

      // Klasifikasi Bentuk Wajah
      const classification = classifyFaceShape(metrics);

      setCurrentMetrics(metrics);
      setImageSource(imgElement);

      // Pilih default kacamata pertama yang 'Very Suitable' untuk bentuk wajah ini
      const shapeSuitability = SUITABILITY_MATRIX[classification.shape];
      const bestMatchCategory = Object.keys(shapeSuitability).find(
        (cat) => shapeSuitability[cat as EyewearModel['category']] === 'Very Suitable'
      ) as EyewearModel['category'] | undefined;

      const defaultFrame =
        EYEWEAR_CATALOG.find((frame) => frame.category === (bestMatchCategory || 'Cat-eye')) ||
        EYEWEAR_CATALOG[0];

      onSelectEyewear(defaultFrame);
      onAnalysisComplete(classification, defaultFrame);

      // Reset fine-tuning
      setScaleAdjustment(1.0);
      setOffsetYAdjustment(0);
    } catch (err: any) {
      console.error('Error saat analisis wajah:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses gambar.');
    } finally {
      setAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  /**
   * Fallback cerdas untuk Sample Photos bawaan jika environment WebGL terbatas
   */
  const useSyntheticFallbackAnalysis = (imgElement: HTMLImageElement, sample: SampleFace) => {
    const width = imgElement.naturalWidth || 400;
    const height = imgElement.naturalHeight || 500;

    const cx = width / 2;
    const cy = height * 0.49;
    const cheekWidth = sample.shapeHint === 'Round' ? width * 0.49 : width * 0.42;
    const faceHeight = cheekWidth * sample.fallbackRatios.lengthToWidth;
    const jawWidth = cheekWidth * sample.fallbackRatios.jawToCheek;
    const foreheadWidth = cheekWidth * sample.fallbackRatios.foreheadToCheek;

    const metrics: FaceMetrics = {
      faceHeight,
      foreheadWidth,
      cheekboneWidth: cheekWidth,
      jawWidth,
      lengthToWidthRatio: sample.fallbackRatios.lengthToWidth,
      jawToCheekRatio: sample.fallbackRatios.jawToCheek,
      foreheadToCheekRatio: sample.fallbackRatios.foreheadToCheek,
      foreheadToJawRatio: sample.fallbackRatios.foreheadToJaw,
      points: {
        foreheadTop: { x: cx, y: cy - faceHeight * 0.5 },
        chinBottom: { x: cx, y: cy + faceHeight * 0.5 },
        templeLeft: { x: cx - foreheadWidth / 2, y: cy - faceHeight * 0.25 },
        templeRight: { x: cx + foreheadWidth / 2, y: cy - faceHeight * 0.25 },
        cheekLeft: { x: cx - cheekWidth / 2, y: cy },
        cheekRight: { x: cx + cheekWidth / 2, y: cy },
        jawLeft: { x: cx - jawWidth / 2, y: cy + faceHeight * 0.3 },
        jawRight: { x: cx + jawWidth / 2, y: cy + faceHeight * 0.3 },
        eyeLeftOuter: { x: cx - cheekWidth * 0.32, y: cy - faceHeight * 0.1 },
        eyeRightOuter: { x: cx + cheekWidth * 0.32, y: cy - faceHeight * 0.1 },
        noseBridge: { x: cx, y: cy - faceHeight * 0.08 },
      },
      imageWidth: width,
      imageHeight: height,
    };

    const classification = classifyFaceShape(metrics);
    setCurrentMetrics(metrics);
    setImageSource(imgElement);

    const shapeSuitability = SUITABILITY_MATRIX[classification.shape];
    const bestMatchCategory = Object.keys(shapeSuitability).find(
      (cat) => shapeSuitability[cat as EyewearModel['category']] === 'Very Suitable'
    ) as EyewearModel['category'] | undefined;

    const defaultFrame =
      EYEWEAR_CATALOG.find((frame) => frame.category === (bestMatchCategory || 'Cat-eye')) ||
      EYEWEAR_CATALOG[0];

    onSelectEyewear(defaultFrame);
    onAnalysisComplete(classification, defaultFrame);
  };

  /**
   * Handle File Upload (Picker & Drag Drop)
   */
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap unggah file gambar yang valid (JPG, PNG, atau WEBP).');
      return;
    }

    if (onReset) onReset();

    const reader = new FileReader();
    reader.onload = (e) => {
      const resultUrl = e.target?.result as string;
      setImageSrcUrl(resultUrl);

      const img = new Image();
      img.onload = () => {
        processImageForLandmarks(img);
      };
      img.src = resultUrl;
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  /**
   * Handle Built-in Sample Photos
   */
  const handleSelectSample = (sample: SampleFace) => {
    setErrorMessage(null);
    if (onReset) onReset();
    setImageSrcUrl(sample.thumbnailUrl);

    const img = new Image();
    img.onload = () => {
      processImageForLandmarks(img, sample);
    };
    img.src = sample.thumbnailUrl;
  };

  /**
   * Webcam Integration
   */
  const startCamera = async () => {
    setErrorMessage(null);
    setImageSource(null);
    setImageSrcUrl(null);
    setCurrentMetrics(null);
    if (onReset) onReset();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      // Jika ref sudah ada langsung pasang
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.warn(err));
      }
    } catch (err: any) {
      console.error('Gagal mengakses kamera:', err);
      setErrorMessage(
        'Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin akses kamera di peramban Anda.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraCountdown(null);
  };

  // Snapshot from Webcam with 3-second countdown
  const triggerCameraCountdown = () => {
    if (cameraCountdown !== null) return;
    setCameraCountdown(3);

    countdownTimerRef.current = setInterval(() => {
      setCameraCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          takeSnapshotNow();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const takeSnapshotNow = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCameraCountdown(null);

    const video = videoRef.current;
    if (!video) return;

    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = vWidth;
    tempCanvas.height = vHeight;

    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontal agar hasil selfie sesuai dengan apa yang dilihat di preview kamera
    ctx.translate(vWidth, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, vWidth, vHeight);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);

    stopCamera();

    const img = new Image();
    img.onload = () => {
      setImageSrcUrl(dataUrl);
      processImageForLandmarks(img);
    };
    img.src = dataUrl;
  };

  const resetAnalyzer = () => {
    stopCamera();
    setImageSource(null);
    setImageSrcUrl(null);
    setCurrentMetrics(null);
    setErrorMessage(null);
    setScaleAdjustment(1.0);
    setOffsetYAdjustment(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onReset) {
      onReset();
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvasAsPng(
      canvasRef.current,
      `facefit-virtual-tryon-${selectedEyewear?.category || 'frame'}.png`
    );
  };

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      {/* ERROR ALERT */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold">Deteksi Wajah Belum Berhasil</h4>
            <p className="text-xs mt-1 text-rose-700 leading-relaxed">{errorMessage}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 transition"
              >
                Tutup Pesan
              </button>
              <button
                onClick={() => handleSelectSample(SAMPLE_PHOTOS[0])}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-800 transition"
              >
                Gunakan Contoh Foto Siap Pakai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. STATE AWAL: SELEKSI SUMBER FOTO */}
      {!imageSource && !isCameraActive && (
        <div className="bg-white rounded-3xl border border-cream-300/80 shadow-lg p-6 sm:p-10 text-center">
          <div className="max-w-xl mx-auto">
            {/* Guide Icon */}
            <div className="w-16 h-16 rounded-2xl bg-terracotta-100 text-terracotta-600 mx-auto flex items-center justify-center mb-4 shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
              Unggah Foto Wajah Anda
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-2 leading-relaxed">
              Untuk hasil presisi optimal: pastikan wajah menghadap lurus ke depan, pencahayaan merata,
              dan tanpa kacamata atau rambut yang menutupi dahi.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={analyzing}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl font-medium text-sm text-white bg-terracotta-600 hover:bg-terracotta-700 active:scale-[0.99] transition shadow-md shadow-terracotta-600/25"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Foto dari Galeri</span>
              </button>

              <button
                onClick={startCamera}
                disabled={analyzing}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl font-medium text-sm text-charcoal-800 bg-cream-100 hover:bg-cream-200 border border-cream-300 transition"
              >
                <Camera className="w-4 h-4 text-olive-600" />
                <span>Gunakan Kamera / Webcam</span>
              </button>
            </div>

            {/* Dropzone Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-charcoal-400 font-medium uppercase tracking-wider">
                  atau coba dengan contoh foto siap pakai
                </span>
              </div>
            </div>

            {/* 3 Built-in Sample Photos */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLE_PHOTOS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    disabled={analyzing}
                    className="group relative p-3 rounded-2xl bg-cream-50 hover:bg-white border border-cream-200 hover:border-terracotta-300 hover:shadow-md transition text-left flex items-center space-x-3"
                  >
                    <div
                      className="w-12 h-14 rounded-xl overflow-hidden shrink-0 border border-cream-300 shadow-sm"
                      dangerouslySetInnerHTML={{ __html: sample.thumbnailUrl }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-charcoal-800 group-hover:text-terracotta-600 transition truncate">
                        {sample.name}
                      </div>
                      <div className="text-[11px] text-charcoal-400 mt-0.5 truncate">
                        {sample.gender} • Demo Cepat
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-charcoal-400 mt-3">
                Klik salah satu contoh untuk langsung menguji sistem tanpa perlu mencari foto.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATE KAMERA AKTIF */}
      {isCameraActive && (
        <div className="bg-white rounded-3xl border border-cream-300/80 shadow-lg p-6 sm:p-8 text-center max-w-2xl mx-auto">
          {/* Header Status Kamera */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-cream-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-charcoal-800 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Kamera Aktif</span>
            </div>
            <span className="text-xs text-charcoal-500">Posisikan wajah Anda di dalam garis panduan</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-charcoal-900 aspect-[4/3] max-w-lg mx-auto shadow-inner flex items-center justify-center">
            <video
              ref={setVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* Countdown Overlay */}
            {cameraCountdown !== null && (
              <div className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-xs flex flex-col items-center justify-center">
                <div className="text-white text-8xl font-serif font-bold animate-bounce drop-shadow-md">
                  {cameraCountdown}
                </div>
                <div className="text-cream-200 text-sm font-semibold tracking-wider mt-2 uppercase">
                  Siap-siap berpose...
                </div>
              </div>
            )}

            {/* Face Alignment Frame Guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-56 h-72 border-2 border-dashed border-white/70 rounded-full shadow-lg shadow-black/20" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {/* Tombol Ambil Langsung */}
            <button
              onClick={takeSnapshotNow}
              disabled={cameraCountdown !== null}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-terracotta-600 hover:bg-terracotta-700 active:scale-[0.99] transition shadow-md shadow-terracotta-600/25"
            >
              <Camera className="w-4 h-4" />
              <span>Ambil Foto Langsung</span>
            </button>

            {/* Tombol Countdown 3 Detik */}
            <button
              onClick={triggerCameraCountdown}
              disabled={cameraCountdown !== null}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm text-charcoal-800 bg-cream-100 hover:bg-cream-200 border border-cream-300 transition"
            >
              <Timer className="w-4 h-4 text-terracotta-600" />
              <span>Hitung Mundur (3s)</span>
            </button>

            {/* Tombol Batal */}
            <button
              onClick={stopCamera}
              className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-xl font-medium text-sm text-charcoal-700 hover:bg-cream-200 transition"
            >
              <X className="w-4 h-4" />
              <span>Batal</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. STATE SCANNING / ANALYZING ANIMATION */}
      {analyzing && (
        <div className="bg-white rounded-3xl border border-cream-300/80 shadow-lg p-10 sm:p-14 text-center max-w-xl mx-auto">
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full bg-terracotta-200/50 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-600 shadow-md">
              <Sparkles className="w-10 h-10 animate-spin stroke-[1.5]" />
            </div>
          </div>

          <h3 className="font-serif text-2xl font-bold text-charcoal-900">
            Menganalisis Geometri Wajah
          </h3>
          <p className="text-sm text-terracotta-600 font-medium mt-2 animate-pulse">
            {analysisProgress || 'Memproses MediaPipe Face Landmarker...'}
          </p>
          <div className="w-48 h-1.5 bg-cream-200 rounded-full mx-auto mt-4 overflow-hidden">
            <div className="w-full h-full bg-terracotta-500 rounded-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      )}

      {/* 4. STATE HASIL: CANVAS INTERAKTIF & KONTROL VIRTUAL TRY-ON */}
      {imageSource && !analyzing && (
        <div className="bg-white rounded-3xl border border-cream-300/80 shadow-md p-4 sm:p-6 space-y-4">
          {/* Header Kontrol Canvas */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cream-200">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Interactive Try-On Canvas
              </span>
              {selectedEyewear && (
                <span className="text-xs text-charcoal-400 hidden sm:inline">
                  • {selectedEyewear.name}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Toggle Face Mesh */}
              <button
                onClick={() => setShowFaceMesh((prev) => !prev)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  showFaceMesh
                    ? 'bg-terracotta-100 text-terracotta-800 border-terracotta-300'
                    : 'bg-cream-100 text-charcoal-700 border-cream-300 hover:bg-cream-200'
                }`}
                title="Tampilkan garis ukur dahi, tulang pipi, dan rahang"
              >
                {showFaceMesh ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showFaceMesh ? 'Sembunyikan Face Mesh' : 'Tampilkan Titik Geometri'}</span>
              </button>

              {/* Toggle Fine Tune */}
              <button
                onClick={() => setShowFineTune((prev) => !prev)}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  showFineTune
                    ? 'bg-olive-100 text-olive-800 border-olive-300'
                    : 'bg-cream-100 text-charcoal-700 border-cream-300 hover:bg-cream-200'
                }`}
                title="Sesuaikan ukuran dan posisi kacamata secara manual"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Fine-Tuning</span>
              </button>
            </div>
          </div>

          {/* Fine Tuning Panel (Collapsible) */}
          {showFineTune && (
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-300 text-xs space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between font-bold text-charcoal-800">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Koreksi Posisi & Skala Manual</span>
                </span>
                <button
                  onClick={() => {
                    setScaleAdjustment(1.0);
                    setOffsetYAdjustment(0);
                  }}
                  className="text-[11px] text-terracotta-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset ke Rekomendasi AI
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Scale Slider */}
                <div>
                  <div className="flex justify-between text-charcoal-600 mb-1">
                    <span>Skala Ukuran Frame:</span>
                    <span className="font-bold text-charcoal-900">{Math.round(scaleAdjustment * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.80"
                    max="1.30"
                    step="0.01"
                    value={scaleAdjustment}
                    onChange={(e) => setScaleAdjustment(parseFloat(e.target.value))}
                    className="w-full accent-terracotta-600 cursor-pointer"
                  />
                </div>

                {/* Vertical Offset Slider */}
                <div>
                  <div className="flex justify-between text-charcoal-600 mb-1">
                    <span>Posisi Vertikal (Tinggi Bridge):</span>
                    <span className="font-bold text-charcoal-900">{offsetYAdjustment > 0 ? `+${offsetYAdjustment}` : offsetYAdjustment} px</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="1"
                    value={offsetYAdjustment}
                    onChange={(e) => setOffsetYAdjustment(parseInt(e.target.value, 10))}
                    className="w-full accent-terracotta-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Canvas Wrapper */}
          <div className="relative rounded-2xl overflow-hidden bg-charcoal-950 flex items-center justify-center shadow-inner min-h-[360px] sm:min-h-[460px]">
            <canvas
              ref={canvasRef}
              className="max-h-[560px] w-auto max-w-full object-contain mx-auto transition-transform"
            />
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={resetAnalyzer}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-charcoal-700 bg-cream-100 hover:bg-cream-200 border border-cream-300 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ganti Foto / Ulangi</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-terracotta-600 hover:bg-terracotta-700 active:scale-[0.99] transition shadow-md shadow-terracotta-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Hasil Try-On (PNG)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
