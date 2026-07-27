import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import Navbar from './components/Navbar';
import DesaCanvas from './components/DesaCanvas';
import LearningPanel from './components/LearningPanel';
import LkpdSection from './components/LkpdSection';
import ErrorBoundary from './components/ErrorBoundary';
import soundNusantara from './assets/sound-nusantara.mp3';
import PanduanModal from './components/PanduanModal';
import ModulGuruModal from './components/ModulGuruModal';
import WebARViewer from './components/WebARViewer';

export type LearningPhase = 'WELCOME' | 'CONCRETE' | 'PICTORIAL' | 'ABSTRACT' | 'LKPD';

export default function App() {
  const [phase, setPhase] = useState<LearningPhase>('WELCOME');
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<null | 'guru' | 'tentang' | 'profil' | 'apersepsi'>(null);
  const [activeWebAR, setActiveWebAR] = useState<{ shape: string; assetName: string } | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    (window as any).setErrorLogs = setErrorLogs;
    const handleError = (e: ErrorEvent) => {
      setErrorLogs(prev => [...prev, `${e.message} at ${e.filename}:${e.lineno}`]);
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      setErrorLogs(prev => [...prev, `Promise Rejection: ${String(e.reason)}`]);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      delete (window as any).setErrorLogs;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Deteksi pemindaian QR Code AR dari URL Parameter (?ar=persegi / segitiga / lingkaran) via Google Lens
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const arShape = params.get('ar');
    if (arShape === 'persegi' || arShape === 'segitiga' || arShape === 'lingkaran') {
      const assetMap: Record<string, string> = {
        persegi: 'Saung',
        segitiga: 'Atap segitiga',
        lingkaran: 'Daun teratai',
      };
      // Langsung buka mode kamera WebAR fullscreen dengan objek 3D & penjelasan pengertian/sifat
      setActiveWebAR({ shape: arShape, assetName: assetMap[arShape] || 'Saung' });
      // Bersihkan URL parameter agar tidak looping
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // Audio Background Nusantara (Menggunakan elemen <audio> DOM yang 100% reliabel)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.6; // Volume nyaman
    }
  }, []);

  const playMusic = () => {
    if (audioRef.current && !audioEnabled) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().then(() => {
        setAudioEnabled(true);
      }).catch((err) => {
        console.error("Gagal memutar audio:", err);
      });
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (!audioEnabled) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().then(() => {
        setAudioEnabled(true);
      }).catch((err) => {
        console.error("Gagal memutar audio:", err);
      });
    } else {
      audioRef.current.pause();
      setAudioEnabled(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-400 via-emerald-100 to-amber-100 font-sans text-stone-800 select-none">

      {/* BACKGROUND VECTOR INDONESIA (Gunung, Sawah, Bendera) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute bottom-24 left-[5%] w-[45%] h-[60%] opacity-40" viewBox="0 0 500 300" preserveAspectRatio="none">
          <polygon points="0,300 200,80 350,300" fill="#2d6a4f" />
          <polygon points="150,300 350,50 500,300" fill="#1b4332" />
        </svg>
        <svg className="absolute bottom-0 w-full h-[38%] opacity-30" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path d="M0 160 Q 250 80, 500 140 T 1000 120 L 1000 200 L 0 200 Z" fill="#52b788" />
          <path d="M0 180 Q 300 120, 600 170 T 1000 150 L 1000 200 L 0 200 Z" fill="#74c69d" />
        </svg>
      </div>

      {/* Native HTML5 Audio Element untuk pemutaran yang 100% stabil di semua browser */}
      <audio ref={audioRef} src={soundNusantara} loop preload="auto" />

      {/* Floating Audio Toggle - Adaptif untuk mobile (ikon ringkas) & desktop */}
      <button
        onClick={toggleAudio}
        className={`fixed top-2.5 right-2 md:top-4 md:right-4 z-[100] flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full border text-[10px] md:text-xs font-bold shadow-md cursor-pointer transition-all ${
          audioEnabled ? 'bg-emerald-600 text-white border-emerald-500 scale-105' : 'bg-white/95 backdrop-blur-md text-stone-600 border-stone-300 hover:bg-white'
        }`}
        title="Klik untuk memutar / menghentikan musik Nusantara"
      >
        {audioEnabled ? <Volume2 size={14} className="animate-pulse md:w-4 md:h-4" /> : <VolumeX size={14} className="md:w-4 md:h-4" />}
        <span className="hidden sm:inline">{audioEnabled ? "AUDIO ON" : "AUDIO OFF"}</span>
      </button>

      <AnimatePresence>
        {phase === 'WELCOME' && (
          <WelcomeScreen onEnter={() => { setPhase('CONCRETE'); playMusic(); }} />
        )}
      </AnimatePresence>

      {phase !== 'WELCOME' && (
        <>
          <Navbar 
            currentPhase={phase} 
            setPhase={(p) => {
              if ((p === 'PICTORIAL' || p === 'ABSTRACT') && !selectedObject) {
                setSelectedObject('persegi');
              }
              setPhase(p);
            }} 
            setActivePopup={setActivePopup} 
          />

          {/* R3F 3D Engine Panggung Konkret */}
          <div className="w-full h-full absolute inset-0 z-10">
            <ErrorBoundary fallbackTitle="Kendala Memuat Desa 3D" fallbackMessage="Koneksi internet atau server grafis Spline sedang sibuk. Silakan coba klik tombol di bawah.">
              <DesaCanvas
                phase={phase}
                onObjectSelect={(name) => {
                  if (phase === 'CONCRETE') {
                    setSelectedObject(name);
                    setPhase('PICTORIAL');
                  }
                }}
              />
            </ErrorBoundary>
          </div>

          <AnimatePresence>
            {(phase === 'PICTORIAL' || phase === 'ABSTRACT') && selectedObject && (
              <LearningPanel
                phase={phase}
                objectName={selectedObject}
                onNextPhase={(next) => setPhase(next)}
                onClose={() => {
                  setPhase('CONCRETE');
                  setSelectedObject(null);
                }}
              />
            )}

            {phase === 'LKPD' && (
              <LkpdSection onBack={() => setPhase('CONCRETE')} />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Pop-up Overlay Menu Tambahan (Modul Guru/Tentang/Profil) */}
      <AnimatePresence>
        {activePopup === 'guru' && (
          <ModulGuruModal onClose={() => setActivePopup(null)} />
        )}

        {activePopup === 'tentang' && (
          <PanduanModal onClose={() => setActivePopup(null)} />
        )}

        {activePopup === 'profil' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
            <div className="bg-white rounded-[28px] w-full max-w-lg p-6 border-4 border-indigo-500 shadow-2xl animate-scale-up max-h-[90vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center border-b pb-3 mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <h3 className="font-black text-indigo-950 text-xs md:text-sm leading-tight uppercase tracking-wide">
                      TIM PENGEMBANGAN KBK MATEMATIKA
                    </h3>
                    <p className="text-[11px] font-bold text-indigo-600">
                      PGSD UPI KAMPUS PURWAKARTA
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePopup(null)}
                  className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-full p-1.5 shadow-sm transition cursor-pointer flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs md:text-sm text-stone-700 my-auto py-1">
                {/* Ketua */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-3.5 rounded-2xl shadow-sm">
                  <h4 className="font-black text-indigo-900 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>👑</span> KETUA PENGEMBANG
                  </h4>
                  <p className="font-bold text-slate-800 pl-5">
                    1. Alfiana Nurussama, S.Pd., M.Pd.
                  </p>
                </div>

                {/* Anggota Dosen */}
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 p-3.5 rounded-2xl shadow-sm">
                  <h4 className="font-black text-sky-900 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>🎓</span> ANGGOTA DOSEN
                  </h4>
                  <ul className="space-y-1 pl-5 font-bold text-slate-800">
                    <li>2. Dr. Hafiziani Eka Putri, M.Pd.</li>
                    <li>3. Teten Ginanjar Rahayu, M.Pd.</li>
                  </ul>
                </div>

                {/* Tim Mahasiswa */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-3.5 rounded-2xl shadow-sm">
                  <h4 className="font-black text-emerald-900 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>🌟</span> TIM MAHASISWA
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5 font-bold text-slate-800">
                    <li>1. Ani Saadah</li>
                    <li>2. Dania Widia Cahyani</li>
                    <li>3. Leni Nurhafidah</li>
                    <li>4. Yuhaniz Aqila</li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-3 mt-3 text-[10px] text-stone-400 font-medium border-t flex-shrink-0">
                Naturmath Space — Media Pembelajaran Geometri Nusantara
              </div>
            </div>
          </div>
        )}

        {activePopup === 'apersepsi' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm font-sans animate-fade-in">
            <div className="bg-white rounded-[28px] w-full max-w-3xl p-5 md:p-6 border-4 border-red-500 shadow-2xl animate-scale-up flex flex-col">
              <div className="flex justify-between items-center border-b pb-3 mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎬</span>
                  <div>
                    <h3 className="font-black text-red-700 text-xs md:text-base uppercase tracking-wider">
                      VIDEO APERSEPSI GEOMETRI NUSANTARA
                    </h3>
                    <p className="text-[11px] font-bold text-stone-500">
                      Mari tonton pengantar seru belajar matematika di Kebun Naturmath!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePopup(null)}
                  className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-full p-1.5 shadow-sm transition cursor-pointer flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* YouTube Responsive Embed Container */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border-2 border-slate-200">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/pWZZyJLV5qs?autoplay=1"
                  title="Video Apersepsi Geometri Nusantara - Naturmath Space"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-xs text-stone-600 font-medium border-t pt-3">
                <span className="flex items-center gap-1">💡 <strong className="text-slate-800">Tips:</strong> Perhatikan bentuk-bentuk bangun datar yang ada di sekitar kita!</span>
                <button
                  onClick={() => setActivePopup(null)}
                  className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold px-4 py-2 rounded-xl shadow transition cursor-pointer ml-auto"
                >
                  Tutup Video ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Live Camera WebAR Mode */}
      <AnimatePresence>
        {activeWebAR && (
          <WebARViewer
            shape={activeWebAR.shape}
            assetName={activeWebAR.assetName}
            onClose={() => setActiveWebAR(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating Debug Error Logs */}
      {errorLogs.length > 0 && (
        <div className="fixed bottom-4 left-4 z-50 max-w-lg bg-red-950/95 text-red-200 border-2 border-red-500/50 p-4 rounded-2xl shadow-2xl text-xs font-mono space-y-2 overflow-y-auto max-h-60 select-text">
          <div className="flex justify-between items-center border-b border-red-500/30 pb-1.5 font-bold">
            <span>🚨 Kesalahan Sistem (Runtime Error)</span>
            <button onClick={() => setErrorLogs([])} className="hover:text-white font-bold px-1.5">Hapus</button>
          </div>
          <div className="space-y-1">
            {errorLogs.map((err, i) => (
              <div key={i} className="bg-black/35 p-1.5 rounded border border-red-500/20">{err}</div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { transform: skewY(0deg) scaleX(1); }
          50% { transform: skewY(3deg) scaleX(0.98); }
        }
      `}</style>
    </div>
  );
}