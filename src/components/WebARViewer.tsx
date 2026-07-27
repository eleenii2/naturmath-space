import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShieldAlert, BookOpen } from 'lucide-react';
import Model3DViewer from './Model3DViewer';
import { educationData, type ShapeEducationData } from './ARModal';

interface WebARViewerProps {
  shape: string;
  assetName: string;
  onClose: () => void;
}

export default function WebARViewer({ shape, assetName, onClose }: WebARViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStatus, setCameraStatus] = useState<'loading' | 'active' | 'error'>('loading');
  const [activeTab, setActiveTab] = useState<'pengertian' | 'sifat'>('pengertian');

  const shapeKey = shape.toLowerCase() === 'segitiga' ? 'segitiga' : shape.toLowerCase() === 'lingkaran' ? 'lingkaran' : 'persegi';
  const data: ShapeEducationData = educationData[shapeKey] || educationData['persegi'];

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    async function startCamera() {
      try {
        setCameraStatus('loading');
        // Utamakan kamera belakang (environment) untuk pengalaman AR sejati
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch (err) {
        // Jika kamera belakang tidak ada (misal di laptop/PC), fallback ke kamera depan/sembarang webcam
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } catch (fallbackErr) {
          console.warn("Kamera tidak dapat diakses atau izin ditolak:", fallbackErr);
          if (isMounted) {
            setCameraStatus('error');
          }
          return;
        }
      }

      if (isMounted && stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStatus('active');
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] bg-black overflow-hidden font-kids select-none flex flex-col justify-between"
    >
      {/* 1. LAYER LATAR BELAKANG KAMERA / SIMULASI HOLOGRAM */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            cameraStatus === 'active' ? 'opacity-100 filter brightness-95' : 'opacity-0'
          }`}
        />

        {/* Fallback Simulasi Hologram jika kamera tidak aktif/di PC */}
        {cameraStatus !== 'active' && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/70 to-slate-900 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-30 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
            {cameraStatus === 'error' && (
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-amber-500/20 border border-amber-500/50 backdrop-blur-md text-amber-200 px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-lg z-10 max-w-sm text-center">
                <ShieldAlert size={16} className="text-amber-400 shrink-0" />
                <span>Mode Simulasi AR Hologram (Kamera aktif otomatis saat dibuka dari perangkat HP/Tablet)</span>
              </div>
            )}
            {cameraStatus === 'loading' && (
              <div className="flex flex-col items-center gap-3 text-emerald-400 font-bold z-10">
                <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm tracking-wider uppercase animate-pulse">Menghubungkan Kamera AR...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. LAYER HUD TARGETING BRACKETS & SCANLINES */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-emerald-400/80 rounded-tl-xl animate-pulse" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-emerald-400/80 rounded-tr-xl animate-pulse" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-emerald-400/80 rounded-bl-xl animate-pulse" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-emerald-400/80 rounded-br-xl animate-pulse" />
      </div>

      {/* 3. TOP BAR NAVIGASI AR */}
      <header className="relative z-30 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <span className="text-xs font-black text-emerald-300 tracking-wider uppercase">AR LIVE CAMERA</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold">
            <span className="text-base">{data.emoji}</span>
            <span>{data.shapeName} • {assetName}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-4 py-2 rounded-full font-black text-xs md:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.5)] border border-rose-400/40 transition-all cursor-pointer"
        >
          <X size={18} />
          <span>Keluar AR</span>
        </button>
      </header>

      {/* 4. CENTER LAYER: OBJEK 3D MELAYANG DI TENGAH KAMERA */}
      <div className="relative z-20 flex-1 flex items-center justify-center p-4 my-2">
        <div className="w-full max-w-4xl h-[42vh] md:h-[50vh] relative flex items-center justify-center">
          <Model3DViewer assetName={assetName} isARMode={true} />
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[10px] px-3 py-1 rounded-full pointer-events-none flex items-center gap-1.5 shadow-lg">
            <Sparkles size={12} className="text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Objek 3D terhubung dengan kamera — Geser untuk memutar</span>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM LAYER: PENJELASAN PENGERTIAN & SIFAT BANGUN DATAR (HUD GLASS CARDS) */}
      <footer className="relative z-30 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col items-center gap-3">
        {/* Tab Toggle Pengertian vs Sifat */}
        <div className="flex bg-slate-900/80 backdrop-blur-lg p-1.5 rounded-2xl border border-emerald-500/40 shadow-xl gap-2">
          <button
            onClick={() => setActiveTab('pengertian')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pengertian'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen size={14} />
            <span>Pengertian</span>
          </button>
          <button
            onClick={() => setActiveTab('sifat')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sifat'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles size={14} />
            <span>Sifat-Sifat ({data.properties.length})</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="w-full max-w-3xl bg-slate-900/85 backdrop-blur-xl border border-emerald-400/40 rounded-3xl p-4 md:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-white min-h-[120px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeTab === 'pengertian' ? (
              <motion.div
                key="pengertian"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <span>📖 Apa itu {data.shapeName}?</span>
                </div>
                <p className="text-sm md:text-base text-slate-100 leading-relaxed font-medium bg-white/5 p-3 rounded-2xl border border-white/10">
                  {data.definition}
                </p>
                <div className="text-[11px] text-amber-300 font-bold bg-amber-500/20 border border-amber-500/40 p-2 rounded-xl flex items-center gap-2 mt-2">
                  <span>💡 Fun Fact:</span>
                  <span className="font-medium text-amber-100">{data.funFact}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sifat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
                  <span>✨ Sifat-Sifat Bangun Datar {data.shapeName}:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Geser untuk melihat semua →</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {data.properties.map((prop, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-emerald-400/30 p-2.5 rounded-xl flex items-center gap-2.5 text-xs text-slate-100 font-medium transition-all shadow-sm"
                    >
                      <span className="text-base shrink-0 bg-emerald-500/20 p-1 rounded-lg">{prop.icon}</span>
                      <span>{prop.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </motion.div>
  );
}
