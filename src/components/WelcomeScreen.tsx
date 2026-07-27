import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoNaturmath from '../assets/logo-naturmath.png';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleStart = () => {
    setIsZooming(true);
    setTimeout(() => {
      onEnter();
    }, 750);
  };

  // Flying particles on button hover
  const hoverParticles = [
    { id: 1, char: '🍃', dx: -60, dy: -50, delay: 0 },
    { id: 2, char: '🌿', dx: 60, dy: -40, delay: 0.1 },
    { id: 3, char: '🌱', dx: -30, dy: -70, delay: 0.05 },
    { id: 4, char: '✨', dx: 40, dy: -60, delay: 0.15 },
    { id: 5, char: '🍃', dx: -80, dy: -20, delay: 0.2 },
    { id: 6, char: '🌸', dx: 80, dy: -30, delay: 0.12 },
  ];

  return (
    <div className={`relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 via-amber-100 to-orange-100 font-kids select-none transition-all duration-750 ${isZooming ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
      
      {/* 1. MATAHARI HANGAT (SUN GLOW) */}
      <div className="absolute top-8 right-12 w-28 h-28 bg-gradient-to-br from-yellow-200 to-amber-400 rounded-full shadow-[0_0_80px_rgba(253,224,71,0.8)] animate-pulse pointer-events-none" />

      {/* 2. AWAN KARTUN BERGERAK PERLAHAN (ANIMATED CLOUDS) */}
      <div className="absolute top-12 left-0 w-full pointer-events-none overflow-hidden z-0">
        <div className="animate-float-cloud flex items-center gap-4 opacity-90">
          <div className="w-32 h-12 bg-white rounded-full relative shadow-md">
            <div className="absolute -top-6 left-4 w-16 h-16 bg-white rounded-full" />
            <div className="absolute -top-4 right-6 w-12 h-12 bg-white rounded-full" />
          </div>
        </div>
      </div>
      <div className="absolute top-28 -left-40 w-full pointer-events-none overflow-hidden z-0" style={{ animationDelay: '12s' }}>
        <div className="animate-float-cloud flex items-center gap-4 opacity-75 scale-75">
          <div className="w-40 h-14 bg-white/90 rounded-full relative shadow-sm">
            <div className="absolute -top-8 left-6 w-20 h-20 bg-white/90 rounded-full" />
            <div className="absolute -top-6 right-8 w-16 h-16 bg-white/90 rounded-full" />
          </div>
        </div>
      </div>

      {/* 3. BURUNG TERBANG & KUPU-KUPU (FLYING BIRDS & BUTTERFLIES) */}
      <div className="absolute top-20 left-[25%] text-2xl animate-sway pointer-events-none opacity-60">🐦</div>
      <div className="absolute top-32 right-[30%] text-xl animate-sway pointer-events-none opacity-50" style={{ animationDelay: '1.5s' }}>🕊️</div>
      <div className="absolute top-1/3 left-16 text-3xl animate-flutter pointer-events-none z-10">🦋</div>
      <div className="absolute bottom-1/3 right-20 text-3xl animate-flutter pointer-events-none z-10" style={{ animationDelay: '0.5s' }}>🦋</div>

      {/* 4. LINGKUNGAN DESA BELAJAR (CLEAN HILLSCAPE) */}
      <div className="absolute bottom-0 left-0 w-full h-[35%] pointer-events-none z-10 flex items-end justify-between overflow-hidden">
        {/* Bukit Kiri */}
        <div className="relative w-[50%] h-full">
          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 500 250" preserveAspectRatio="none">
            <path d="M0 100 Q 250 -20 500 160 L 500 250 L 0 250 Z" fill="#22c55e" opacity="0.85" />
            <path d="M0 140 Q 200 40 450 200 L 500 250 L 0 250 Z" fill="#16a34a" opacity="0.95" />
          </svg>
        </div>

        {/* Bukit Kanan */}
        <div className="relative w-[55%] h-full">
          <svg className="absolute bottom-0 right-0 w-full h-full" viewBox="0 0 600 250" preserveAspectRatio="none">
            <path d="M100 170 Q 350 0 600 90 L 600 250 L 100 250 Z" fill="#4ade80" opacity="0.8" />
            <path d="M200 210 Q 400 80 600 140 L 600 250 L 200 250 Z" fill="#22c55e" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* 5. MOTIF BATIK NUSANTARA (BOTTOM ORNAMENT BAR) */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 text-amber-100 py-2 px-4 z-30 shadow-lg flex items-center justify-center gap-3 text-xs md:text-sm font-bold tracking-widest uppercase border-t-2 border-amber-400/50">
        <span>🔸</span>
        <span>Motif Batik Nusantara & Kearifan Lokal Indonesia</span>
        <span>🔸</span>
        <span className="hidden md:inline">Eksplorasi Geometri SD Kelas IV</span>
        <span>🔸</span>
      </div>

      {/* 6. KONTEN UTAMA (MODERN PREMIUM GLASSMORPHISM CARD) */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 md:p-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white backdrop-blur-xl border-4 border-white rounded-[44px] p-6 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.18)] max-w-2xl w-full text-center relative overflow-hidden"
        >
          {/* Subtle batik watermarks inside card */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

          {/* Bagian Atas: Logo Naturmath Space (Latar Putih Menyamar / Menyatu) */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto flex items-center justify-center mb-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 to-amber-300/20 rounded-full blur-2xl animate-pulse" />
            <img 
              src={logoNaturmath} 
              alt="Logo Naturmath Space" 
              className="w-24 h-24 md:w-28 md:h-28 object-contain relative z-10 mix-blend-multiply hover:scale-110 transition-transform duration-500 cursor-pointer animate-sway" 
              style={{ mixBlendMode: 'multiply', animationDuration: '5s' }}
            />
          </div>

          {/* Judul Besar */}
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 drop-shadow-sm mb-3">
            Selamat Datang di <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              Naturmath Space
            </span>
          </h1>

          {/* Subjudul Kontras Tinggi */}
          <p className="text-slate-700 font-extrabold text-base md:text-lg leading-relaxed max-w-lg mx-auto px-2 mb-8 drop-shadow-xs">
            Belajar Bangun Datar melalui <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy">Alam dan Budaya Indonesia</span> dengan cara yang seru, interaktif, dan menyenangkan!
          </p>

          {/* Bagian Bawah Tengah: Tombol Utama Hijau Cerah */}
          <div className="relative inline-block">
            {/* Flying particles when hovered */}
            <AnimatePresence>
              {isHovered && hoverParticles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 0, x: p.dx, y: p.dy, scale: 1.3, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, delay: p.delay, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 text-2xl pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
                >
                  {p.char}
                </motion.span>
              ))}
            </AnimatePresence>

            <button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleStart}
              disabled={isZooming}
              className={`relative group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-black text-xl md:text-2xl tracking-wide shadow-[0_12px_30px_rgba(34,197,94,0.5)] border-4 border-white transition-all duration-300 cursor-pointer ${
                isHovered 
                  ? 'scale-108 shadow-[0_0_45px_rgba(34,197,94,0.85)] -translate-y-1.5' 
                  : 'hover:scale-105 active:scale-95'
              }`}
            >
              <span>Mulai Belajar</span>
              <span className="text-2xl transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-125">🚀</span>
            </button>
          </div>

          {/* Kids friendly hint footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
            <span>✨ Sentuh tombol hijau untuk menjelajahi keajaiban desa 3D! ✨</span>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default WelcomeScreen;
