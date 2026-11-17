// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FaceFit - AI Eyewear Recommendation & Virtual Try-On',
  description:
    'Sistem rekomendasi frame kacamata objektif berbasis bentuk wajah dengan deteksi 478 landmark MediaPipe dan Virtual Try-On langsung di browser.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-cream-100 text-charcoal-900 flex flex-col antialiased selection:bg-terracotta-200 selection:text-terracotta-900 font-sans">
        {children}
      </body>
    </html>
  );
}
