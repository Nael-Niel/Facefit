// src/utils/canvasRenderer.ts

import { EyewearModel } from '@/data/eyewearData';
import { FaceMetrics } from './faceGeometry';

export interface RenderOptions {
  canvas: HTMLCanvasElement;
  sourceImage: HTMLImageElement | HTMLVideoElement;
  metrics: FaceMetrics | null;
  selectedEyewear: EyewearModel | null;
  showFaceMesh: boolean;
  scaleAdjustment?: number; // 0.8 to 1.3 (default 1.0)
  offsetYAdjustment?: number; // -50 to +50 (default 0)
}

// In-memory cache for parsed SVG images to enable buttery smooth re-rendering
const svgImageCache = new Map<string, HTMLImageElement>();

/**
 * Mendapatkan elemen HTMLImageElement dari string SVG
 */
export function getOrCreateSvgImage(eyewear: EyewearModel): Promise<HTMLImageElement> {
  const cached = svgImageCache.get(eyewear.id);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([eyewear.svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    img.src = blobUrl;

    img.onload = () => {
      svgImageCache.set(eyewear.id, img);
      resolve(img);
    };
    img.onerror = (err) => {
      console.error('Gagal memuat gambar SVG kacamata:', eyewear.name, err);
      reject(err);
    };
  });
}

/**
 * Fungsi utama render canvas: foto dasar + face mesh (opsional) + overlay kacamata
 */
export async function renderTryOnCanvas({
  canvas,
  sourceImage,
  metrics,
  selectedEyewear,
  showFaceMesh,
  scaleAdjustment = 1.0,
  offsetYAdjustment = 0,
}: RenderOptions): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Tentukan ukuran internal canvas sesuai ukuran asli gambar/video
  const srcWidth =
    'naturalWidth' in sourceImage
      ? sourceImage.naturalWidth
      : 'videoWidth' in sourceImage
      ? sourceImage.videoWidth
      : canvas.width;

  const srcHeight =
    'naturalHeight' in sourceImage
      ? sourceImage.naturalHeight
      : 'videoHeight' in sourceImage
      ? sourceImage.videoHeight
      : canvas.height;

  if (srcWidth === 0 || srcHeight === 0) return;

  if (canvas.width !== srcWidth || canvas.height !== srcHeight) {
    canvas.width = srcWidth;
    canvas.height = srcHeight;
  }

  // 1. Gambar foto asli pengguna ke Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

  // Jika metrik wajah tersedia, lakukan overlay
  if (metrics) {
    // 2. Gambar overlay kacamata (jika ada kacamata yang dipilih)
    if (selectedEyewear) {
      try {
        const eyewearImg = await getOrCreateSvgImage(selectedEyewear);

        const { eyeLeftOuter, eyeRightOuter, noseBridge, cheekLeft, cheekRight } = metrics.points;

        // A. Posisi Pusat: Titik 168 (nose bridge)
        // Hitung sudut rotasi kepala dari titik luar mata: atan2(y263 - y33, x263 - x33)
        const dEyeX = eyeRightOuter.x - eyeLeftOuter.x;
        const dEyeY = eyeRightOuter.y - eyeLeftOuter.y;
        const angle = Math.atan2(dEyeY, dEyeX);

        // B. Lebar Kacamata: 1.15 * L_pipi dikalikan scale factor
        const cheekWidth = Math.sqrt(
          Math.pow(cheekRight.x - cheekLeft.x, 2) + Math.pow(cheekRight.y - cheekLeft.y, 2)
        );
        const baseWidth = cheekWidth * 1.15;
        const glassesWidth = baseWidth * scaleAdjustment;
        const aspectRatio = selectedEyewear.frameHeight / selectedEyewear.frameWidth;
        const glassesHeight = glassesWidth * aspectRatio;

        // C. Posisi (x, y) dengan koreksi offset arah tegak lurus kepala (offset Y lokal)
        const perpX = -Math.sin(angle);
        const perpY = Math.cos(angle);

        // Koreksi vertikal: sedikit dinaikkan sekitar 5% dari tinggi kacamata agar pas di hidung
        const naturalBridgeOffset = -glassesHeight * 0.04;
        const totalOffsetY = naturalBridgeOffset + offsetYAdjustment;

        const centerX = noseBridge.x + perpX * totalOffsetY;
        const centerY = noseBridge.y + perpY * totalOffsetY;

        // Render kacamata dengan rotasi dan penskalaan
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.drawImage(
          eyewearImg,
          -glassesWidth / 2,
          -glassesHeight / 2,
          glassesWidth,
          glassesHeight
        );
        ctx.restore();
      } catch (err) {
        console.error('Error saat merender kacamata di canvas:', err);
      }
    }

    // 3. Gambar Titik Geometri (Face Mesh) jika diaktifkan
    if (showFaceMesh) {
      drawFaceGeometryMesh(ctx, metrics);
    }
  }
}

/**
 * Menggambar visualisasi garis pengukuran geometri wajah dan titik-titik landmark
 */
function drawFaceGeometryMesh(ctx: CanvasRenderingContext2D, metrics: FaceMetrics) {
  const { points } = metrics;
  const scale = Math.max(1, ctx.canvas.width / 800);

  ctx.save();

  // Helper untuk menggambar garis ukur dengan gaya elegan
  const drawMeasureLine = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    color: string,
    lineWidth: number,
    label: string,
    valText: string
  ) => {
    // Garis Utama
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * scale;
    ctx.setLineDash([4 * scale, 3 * scale]);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]); // reset dash

    // Titik Ujung
    drawPoint(p1, color, 4 * scale);
    drawPoint(p2, color, 4 * scale);

    // Label di tengah garis
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    const text = `${label} (${valText})`;
    ctx.font = `600 ${Math.round(11 * scale)}px Inter, sans-serif`;
    const textMetrics = ctx.measureText(text);
    const boxW = textMetrics.width + 12 * scale;
    const boxH = 18 * scale;

    ctx.fillStyle = 'rgba(30, 30, 30, 0.85)';
    ctx.beginPath();
    ctx.roundRect(midX - boxW / 2, midY - boxH / 2, boxW, boxH, 4 * scale);
    ctx.fill();

    ctx.fillStyle = '#FAF9F6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, midX, midY);
  };

  // Helper menggambar landmark bulat
  function drawPoint(p: { x: number; y: number }, color: string, radius: number) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }

  // A. Garis Tinggi Wajah P (Landmark 10 -> 152) - Terracotta / Aksen Primer
  drawMeasureLine(
    points.foreheadTop,
    points.chinBottom,
    '#7C432B',
    2.5,
    'Tinggi Wajah (P)',
    `${Math.round(metrics.faceHeight)}px`
  );

  // B. Garis Lebar Dahi (Landmark 103 -> 332) - Warm Gold
  drawMeasureLine(
    points.templeLeft,
    points.templeRight,
    '#D4AF37',
    2,
    'Lebar Dahi (L_dahi)',
    `${Math.round(metrics.foreheadWidth)}px`
  );

  // C. Garis Lebar Pipi (Landmark 234 -> 454) - Olive Green / Aksen Sekunder
  drawMeasureLine(
    points.cheekLeft,
    points.cheekRight,
    '#6B7F5E',
    2.5,
    'Lebar Pipi (L_pipi)',
    `${Math.round(metrics.cheekboneWidth)}px`
  );

  // D. Garis Lebar Rahang (Landmark 172 -> 397) - Blueish Slate
  drawMeasureLine(
    points.jawLeft,
    points.jawRight,
    '#3B82F6',
    2,
    'Lebar Rahang (L_rahang)',
    `${Math.round(metrics.jawWidth)}px`
  );

  // E. Titik Nose Bridge & Mata (Highlight Try-on Anchors)
  drawPoint(points.noseBridge, '#EF4444', 5 * scale); // Titik pusat kacamata (Merah cerah)
  drawPoint(points.eyeLeftOuter, '#10B981', 3.5 * scale);
  drawPoint(points.eyeRightOuter, '#10B981', 3.5 * scale);

  ctx.restore();
}

/**
 * Mengunduh isi canvas saat ini sebagai file gambar PNG
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename = 'facefit-virtual-tryon.png'): void {
  try {
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Gagal mengunduh gambar canvas:', error);
    alert('Maaf, gagal menyimpan gambar. Pastikan gambar tidak terkena batasan CORS.');
  }
}
