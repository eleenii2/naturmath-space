import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ChevronRight, Lightbulb } from 'lucide-react';
import Model3DViewer from './Model3DViewer';
import AnimatedGeometry from './AnimatedGeometry';
import WebARViewer from './WebARViewer';

/* ============================================
   DATA EDUKASI PER BANGUN DATAR
   ============================================ */
export interface ShapeEducationData {
  emoji: string;
  shapeName: string;
  definition: string;
  properties: { icon: string; text: string }[];
  funFact: string;
}

export const educationData: Record<string, ShapeEducationData> = {
  persegi: {
    emoji: '🟦',
    shapeName: 'Persegi',
    definition: 'Persegi adalah bangun datar yang mempunyai empat sisi yang sama panjang. Keempat sudutnya berbentuk siku-siku, seperti sudut pada pojok buku atau meja.',
    properties: [
      { icon: '🟩', text: 'Persegi mempunyai 4 sisi.' },
      { icon: '📏', text: 'Semua sisinya sama panjang.' },
      { icon: '📍', text: 'Persegi mempunyai 4 titik sudut.' },
      { icon: '📐', text: 'Semua sudutnya berbentuk siku-siku (90°).' },
      { icon: '↔️', text: 'Sisi yang saling berhadapan selalu sejajar.' },
    ],
    funFact: 'Karena semua sisinya sama panjang, persegi terlihat rapi dan seimbang.',
  },
  segitiga: {
    emoji: '🔺',
    shapeName: 'Segitiga',
    definition: 'Segitiga adalah bangun datar yang mempunyai tiga sisi dan tiga titik sudut. Bentuknya dapat berbeda-beda, tetapi selalu memiliki tiga sisi.',
    properties: [
      { icon: '🔺', text: 'Segitiga mempunyai 3 sisi.' },
      { icon: '📍', text: 'Segitiga mempunyai 3 titik sudut.' },
      { icon: '📐', text: 'Ketiga sisinya saling bertemu hingga membentuk bangun yang tertutup.' },
    ],
    funFact: 'Meskipun bentuk segitiga bisa bermacam-macam, jumlah sisinya tetap tiga.',
  },
  lingkaran: {
    emoji: '⚪',
    shapeName: 'Lingkaran',
    definition: 'Lingkaran adalah bangun datar yang berbentuk bulat. Lingkaran tidak memiliki sudut dan semua bagian tepinya melengkung.',
    properties: [
      { icon: '⭕', text: 'Lingkaran mempunyai 1 sisi yang melengkung.' },
      { icon: '🚫', text: 'Lingkaran tidak memiliki sisi lurus.' },
      { icon: '🚫', text: 'Lingkaran tidak memiliki titik sudut.' },
      { icon: '📍', text: 'Lingkaran mempunyai satu titik pusat di bagian tengahnya.' },
    ],
    funFact: 'Semua bagian tepi lingkaran memiliki jarak yang sama ke titik pusat. Itulah yang membuat bentuknya selalu bulat.',
  },
};

/* ============================================
   REAL QR CODE GENERATOR (Google Lens Scannable)
   ============================================ */
function QRCodeSVG({ shape, size = 220 }: { shape: string; size?: number }) {
  // Dapatkan URL origin web saat ini (saat dihosting di Vercel/Netlify/Github Pages/dll)
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://naturmath-space.vercel.app';
  const targetUrl = `${origin}/?ar=${shape}`;
  
  // API QR Server menghasilkan QR Code standar ISO 100% nyata dengan High Error Correction (ecc=H) agar bisa discan Google Lens
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&ecc=H&data=${encodeURIComponent(targetUrl)}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <img 
          src={qrApiUrl} 
          alt={`QR Code AR ${shape}`} 
          width={size} 
          height={size} 
          className="rounded-xl object-contain bg-white block shadow-sm"
        />
        {/* Center icon badge */}
        <div className="absolute bg-white/95 p-1 rounded-lg shadow-md border border-emerald-200 text-xl flex items-center justify-center w-9 h-9">
          {shape === 'persegi' ? '🟦' : shape === 'segitiga' ? '🔺' : '⚪'}
        </div>
      </div>
      <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full max-w-[220px] truncate shadow-2xs font-bold" title={targetUrl}>
        🔗 {targetUrl}
      </div>
    </div>
  );
}


/* ============================================
   AR MODAL COMPONENT
   ============================================ */
interface ARModalProps {
  isOpen: boolean;
  onClose: () => void;
  shape: 'persegi' | 'segitiga' | 'lingkaran';
  assetName: string;
  displayName: string;
  initialPhase?: 'QR' | 'EXPERIENCE';
}

export default function ARModal({ isOpen, onClose, shape, assetName, displayName, initialPhase = 'QR' }: ARModalProps) {
  const [phase, setPhase] = useState<'QR' | 'EXPERIENCE'>('QR');
  const [drawComplete, setDrawComplete] = useState(false);
  const [activePropertyIndex, setActivePropertyIndex] = useState(-1);
  const [showFunFact, setShowFunFact] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const propertyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const data = educationData[shape];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPhase(initialPhase);
      setDrawComplete(false);
      setActivePropertyIndex(-1);
      setShowFunFact(false);
      setAnimationStarted(false);
    }
    return () => {
      if (propertyTimerRef.current) clearTimeout(propertyTimerRef.current);
    };
  }, [isOpen, initialPhase]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Start sequential property animation
  const startPropertyAnimation = useCallback(() => {
    if (animationStarted) return;
    setAnimationStarted(true);

    // First draw the outline
    setDrawComplete(true);

    // After outline finishes (2s), start properties
    propertyTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      let index = 0;

      const showNext = () => {
        if (!mountedRef.current) return;
        if (index < data.properties.length) {
          setActivePropertyIndex(index);
          index++;
          propertyTimerRef.current = setTimeout(showNext, 2200);
        } else {
          // Show fun fact after all properties
          propertyTimerRef.current = setTimeout(() => {
            if (mountedRef.current) setShowFunFact(true);
          }, 800);
        }
      };

      showNext();
    }, 2200);
  }, [animationStarted, data.properties.length]);

  // Auto-start animation when entering experience phase
  useEffect(() => {
    if (phase === 'EXPERIENCE') {
      const timer = setTimeout(() => startPropertyAnimation(), 600);
      return () => clearTimeout(timer);
    }
  }, [phase, startPropertyAnimation]);

  if (!isOpen) return null;

  if (phase === 'EXPERIENCE') {
    return (
      <WebARViewer
        shape={shape}
        assetName={assetName}
        onClose={onClose}
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-950/80 to-slate-900/90" onClick={onClose} />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 180 }}
            className="relative z-10 w-[95vw] max-w-5xl max-h-[92vh] bg-gradient-to-br from-white via-slate-50 to-emerald-50 rounded-[28px] shadow-2xl overflow-hidden flex flex-col border border-emerald-200/40"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-lg backdrop-blur-sm">
                  {data.emoji}
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-wide uppercase">
                    {phase === 'QR' ? '📱 Augmented Reality' : `✨ ${data.shapeName} — Pengalaman AR`}
                  </h2>
                  <p className="text-[10px] text-emerald-100 font-medium">
                    {phase === 'QR' ? `Objek: ${displayName}` : `Objek Nusantara: ${displayName}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/15 hover:bg-white/30 rounded-xl transition-all cursor-pointer backdrop-blur-sm"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {phase === 'QR' ? (
                  <QRPhase
                    key="qr"
                    shape={shape}
                    displayName={displayName}
                    data={data}
                    onStartExperience={() => setPhase('EXPERIENCE')}
                  />
                ) : (
                  <ExperiencePhase
                    key="exp"
                    shape={shape}
                    assetName={assetName}
                    data={data}
                    drawComplete={drawComplete}
                    activePropertyIndex={activePropertyIndex}
                    showFunFact={showFunFact}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================
   PHASE 1: QR CODE
   ============================================ */
function QRPhase({
  shape,
  displayName,
  data,
  onStartExperience,
}: {
  shape: string;
  displayName: string;
  data: ShapeEducationData;
  onStartExperience: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col lg:flex-row items-center justify-center gap-8 p-6 md:p-10 min-h-[420px]"
    >
      {/* QR Code Section */}
      <div className="flex flex-col items-center gap-5">
        {/* Animated ring around QR */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-emerald-400 via-cyan-400 to-teal-400 opacity-20 blur-lg animate-spin-slow" />
          <div className="relative bg-white p-4 rounded-2xl shadow-xl border-2 border-emerald-200">
            <QRCodeSVG shape={shape} size={220} />
          </div>
          {/* Scanning effect overlay */}
          <div className="absolute inset-4 rounded-xl overflow-hidden pointer-events-none">
            <div className="w-full h-full qr-shimmer-bg" />
          </div>
        </div>

        {/* Shape badge */}
        <div className="animate-float-badge flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 px-4 py-1.5 rounded-full shadow-sm">
          <span className="text-lg">{data.emoji}</span>
          <span className="text-xs font-black text-emerald-800 tracking-wide">{data.shapeName.toUpperCase()}</span>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="flex flex-col items-center lg:items-start gap-4 max-w-sm text-center lg:text-left">
        <div className="flex items-center gap-2 text-emerald-700">
          <Smartphone size={22} />
          <h3 className="text-base font-black tracking-wide">Pindai Kode AR</h3>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Pindai kode ini menggunakan <strong className="text-emerald-700">Google Lens</strong> atau kamera ponsel yang mendukung AR untuk melihat objek <strong className="text-emerald-700">{displayName}</strong> dalam Augmented Reality.
        </p>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
            <span className="text-base">📷</span>
            <span>Buka Google Lens → Arahkan ke QR Code</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
            <span className="text-base">✨</span>
            <span>Objek 3D akan muncul di meja kelas kamu!</span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full mt-1">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] text-slate-400 font-bold tracking-widest">ATAU</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Direct experience button */}
        <button
          onClick={onStartExperience}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-black text-xs py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer tracking-wider uppercase active:scale-[0.97] animate-pulse"
        >
          <Smartphone size={16} />
          <span>📱 Lihat AR Sekarang (Buka Kamera)</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

/* ============================================
   PHASE 2: AR EXPERIENCE
   ============================================ */
function ExperiencePhase({
  shape,
  assetName,
  data,
  drawComplete,
  activePropertyIndex,
  showFunFact,
}: {
  shape: 'persegi' | 'segitiga' | 'lingkaran';
  assetName: string;
  data: ShapeEducationData;
  drawComplete: boolean;
  activePropertyIndex: number;
  showFunFact: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col lg:flex-row gap-0 min-h-[460px]"
    >
      {/* Left: 3D Model + Geometry Overlay */}
      <div className="lg:w-1/2 flex flex-col relative">
        {/* 3D Viewer */}
        <div className="flex-1 min-h-[240px] lg:min-h-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 relative overflow-hidden">
          {/* Decorative corner glows */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="absolute inset-0 z-10">
            <Model3DViewer assetName={assetName} />
          </div>

          {/* Badge overlay */}
          <div className="absolute top-3 left-3 z-20 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase shadow-md border border-emerald-400/30">
            Model 3D Interaktif
          </div>
        </div>

        {/* Geometry SVG Overlay Panel */}
        <div className="h-[220px] lg:h-[240px] bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 flex items-center justify-center relative">
          <div className="absolute top-2 left-3 z-10 bg-emerald-100 border border-emerald-200 text-[9px] font-bold text-emerald-700 px-2 py-0.5 rounded-md tracking-wide">
            Bentuk Geometri
          </div>
          <AnimatedGeometry
            shape={shape}
            activePropertyIndex={activePropertyIndex}
            drawComplete={drawComplete}
          />
        </div>
      </div>

      {/* Right: Education Panel */}
      <div className="lg:w-1/2 flex flex-col bg-white border-l border-slate-100 overflow-y-auto">
        <div className="p-5 space-y-4">
          {/* Shape Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-emerald-200">
              {data.emoji}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">{data.shapeName}</h3>
              <p className="text-[11px] text-emerald-600 font-bold tracking-wide">Bangun Datar</p>
            </div>
          </div>

          {/* Definition */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl p-4 border border-sky-200 shadow-sm"
          >
            <h4 className="text-xs font-black text-sky-800 flex items-center gap-1.5 mb-2">
              📖 Apa itu {data.shapeName}?
            </h4>
            <p className="text-[12px] text-slate-700 leading-relaxed font-medium">
              {data.definition}
            </p>
          </motion.div>

          {/* Properties Section */}
          <div className="space-y-2">
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-xs font-black text-emerald-800 flex items-center gap-1.5"
            >
              ✨ Yuk, Kenali Sifat {data.shapeName}!
            </motion.h4>

            <div className="space-y-2">
              {data.properties.map((prop, index) => (
                <PropertyCard
                  key={index}
                  icon={prop.icon}
                  text={prop.text}
                  index={index}
                  isActive={activePropertyIndex === index}
                  isVisible={activePropertyIndex >= index}
                />
              ))}
            </div>
          </div>

          {/* Fun Fact */}
          <AnimatePresence>
            {showFunFact && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 18, stiffness: 150 }}
                className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-amber-300 shadow-md"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-amber-800 mb-1">💡 Tahukah kamu?</h4>
                    <p className="text-[12px] text-amber-900 leading-relaxed font-medium">
                      {data.funFact}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================
   PROPERTY CARD
   ============================================ */
function PropertyCard({
  icon,
  text,
  index: _index,
  isActive,
  isVisible,
}: {
  icon: string;
  text: string;
  index: number;
  isActive: boolean;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-500 ${
        isActive
          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400 shadow-md shadow-emerald-100 ring-2 ring-emerald-300/40'
          : 'bg-slate-50/60 border-slate-200 shadow-sm'
      }`}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all duration-300 ${
        isActive
          ? 'bg-emerald-500 shadow-lg scale-110'
          : 'bg-white border border-slate-200'
      }`}>
        <span className={isActive ? 'animate-bounce' : ''}>{icon}</span>
      </div>

      {/* Text */}
      <p className={`text-[12px] leading-relaxed font-semibold transition-colors duration-300 ${
        isActive ? 'text-emerald-900' : 'text-slate-600'
      }`}>
        {text}
      </p>

      {/* Active indicator */}
      {isActive && (
        <div className="ml-auto flex-shrink-0">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
        </div>
      )}
    </motion.div>
  );
}
