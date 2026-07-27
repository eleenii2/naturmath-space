import { useState } from 'react';
import { motion } from 'framer-motion';
import type { LearningPhase } from '../App';
import { X, Sparkles, Info, CheckCircle2 } from 'lucide-react';
import Model3DViewer from './Model3DViewer';
import ARModal from './ARModal';

// Asset Mapping configuration
const assetDataMap: {
  [key: string]: {
    shape: 'persegi' | 'segitiga' | 'lingkaran';
    displayName: string;
    description: string;
    explanation: string;
  };
} = {
  'Atap segitiga': {
    shape: 'segitiga',
    displayName: 'Atap Gazebo',
    description: 'Atap kayu dari gazebo (saung) tradisional di kebun nusantara.',
    explanation: 'Atap gazebo berbentuk segitiga berfungsi mengalirkan air hujan dengan optimal di iklim tropis Indonesia.',
  },
  'Bunga rami biru segitiga': {
    shape: 'segitiga',
    displayName: 'Bunga Rami Biru',
    description: 'Bunga hias biru indah dengan kelopak menyerupai segitiga.',
    explanation: 'Kelopak bunga rami biru tumbuh secara simetris membentuk pola segitiga untuk memaksimalkan penyerbukan.',
  },
  'Batu': {
    shape: 'persegi',
    displayName: 'Batu Hias Persegi',
    description: 'Batu taman datar berbentuk persegi untuk jalan setapak.',
    explanation: 'Permukaan batu dipotong rata membentuk persegi agar tertata rapi dan aman dipijak di taman.',
  },
  'Batu persegi': {
    shape: 'persegi',
    displayName: 'Batu Hias Persegi',
    description: 'Batu taman datar berbentuk persegi untuk jalan setapak.',
    explanation: 'Batu datar persegi memberikan fondasi yang seimbang dan simetris di sepanjang jalan setapak taman.',
  },
  'batik kebat persegi': {
    shape: 'persegi',
    displayName: 'Kain Batik Kebat',
    description: 'Kain batik dengan motif ceplokan persegi tradisional.',
    explanation: 'Pola batik kebat menggunakan pengulangan bentuk persegi (geometris) yang melambangkan keseimbangan hidup.',
  },
  'Daun teratai': {
    shape: 'lingkaran',
    displayName: 'Daun Teratai Bulat',
    description: 'Daun teratai lebar mengapung yang berbentuk lingkaran.',
    explanation: 'Bentuk lingkaran pada daun teratai menyebarkan berat secara merata agar tetap mengapung seimbang di permukaan air.',
  },
};

// Fallback resolver for navbar shape clicks
const resolveAsset = (name: string) => {
  if (assetDataMap[name]) return { assetName: name, data: assetDataMap[name] };
  if (name === 'segitiga') return { assetName: 'Atap segitiga', data: assetDataMap['Atap segitiga'] };
  if (name === 'lingkaran') return { assetName: 'Daun teratai', data: assetDataMap['Daun teratai'] };
  return { assetName: 'Batu', data: assetDataMap['Batu'] };
};

interface PanelProps {
  phase: LearningPhase;
  objectName: string;
  onNextPhase: (next: LearningPhase) => void;
  onClose: () => void;
}

export default function LearningPanel({ phase, objectName, onNextPhase, onClose }: PanelProps) {
  const [showARModal, setShowARModal] = useState(false);
  const [arModalPhase, setArModalPhase] = useState<'QR' | 'EXPERIENCE'>('QR');

  const { assetName, data } = resolveAsset(objectName);
  const shape = data.shape;

  // Formally close or transition resets
  const handleClose = () => {
    setShowARModal(false);
    onClose();
  };

  const handleNext = (next: LearningPhase) => {
    setShowARModal(false);
    onNextPhase(next);
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 130 }}
      className="fixed top-20 right-2 bottom-2 md:top-20 md:right-5 md:bottom-4 w-[96vw] max-w-[480px] md:max-w-[500px] z-40 pointer-events-none flex flex-col font-kids"
    >
      <div className="bg-white/95 backdrop-blur-xl border-4 border-amber-400/80 p-5 md:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.25)] rounded-[32px] pointer-events-auto flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4 flex-shrink-0">
          <h2 className="text-sm md:text-base font-black text-amber-800 tracking-wider uppercase">
            {phase === 'PICTORIAL' ? '📱 TAHAP 2: JELAJAH BENTUK' : '✏️ TAHAP 3: PINTAR BANGUN DATAR'}
          </h2>
          <button onClick={handleClose} className="bg-rose-500 hover:bg-rose-600 active:scale-90 text-white rounded-full p-1.5 shadow-sm transition-all cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-auto py-1">
          {/* PICTORIAL PHASE */}
          {phase === 'PICTORIAL' && (
            <div className="space-y-4 my-auto">
              {/* Objek Diamati Card */}
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 p-4 rounded-2xl border border-amber-300 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl border border-amber-200 overflow-hidden shadow-inner flex-shrink-0 relative flex items-center justify-center">
                    <Model3DViewer assetName={assetName} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl md:text-2xl">{shape === 'segitiga' ? '🏡' : shape === 'persegi' ? '🧱' : '🌿'}</span>
                      <h3 className="text-base font-black capitalize text-slate-800 truncate">Objek: {data.displayName}</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{data.description}</p>
                  </div>
                </div>
              </div>

              {/* Menu Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => { setArModalPhase('QR'); setShowARModal(true); }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white p-3.5 rounded-2xl font-black text-xs md:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400"
                >
                  <span className="text-lg">📱</span>
                  <span>Pindai Kamera AR</span>
                </button>
                <button
                  onClick={() => { setArModalPhase('EXPERIENCE'); setShowARModal(true); }}
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 active:scale-95 text-white p-3.5 rounded-2xl font-black text-xs md:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-sky-400"
                >
                  <span className="text-lg">💻</span>
                  <span>Sketsa 3D & 2D</span>
                </button>
              </div>

              {/* AR Modal — Full-screen overlay */}
              <ARModal
                isOpen={showARModal}
                onClose={() => setShowARModal(false)}
                shape={shape}
                assetName={assetName}
                displayName={data.displayName}
                initialPhase={arModalPhase}
              />
            </div>
          )}

          {/* ABSTRACT PHASE */}
          {phase === 'ABSTRACT' && (
            <div className="space-y-4 animate-fade-in my-auto">
              {/* Visual Sandingan 3D vs 2D */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-around gap-2">
                <div className="w-18 h-18 bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">3D</span>
                  <div className="w-full h-12">
                    <Model3DViewer assetName={assetName} />
                  </div>
                </div>
                <div className="text-slate-400 font-bold">➔</div>
                <div className="w-18 h-18 bg-white border rounded-xl flex flex-col items-center justify-center shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-400">2D</span>
                  <div className="text-2xl mt-1">{shape === 'segitiga' ? '📐' : shape === 'persegi' ? '🟩' : '🟡'}</div>
                </div>
                <div className="max-w-[180px] text-[10px] text-slate-500 leading-normal">
                  Transisi dari bentuk fisik konkret 3D ke abstraksi rumus bangun datar 2D.
                </div>
              </div>

              {/* Sifat Bangun Card */}
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl shadow-inner space-y-3">
                <h3 className="font-black text-indigo-800 text-xs flex items-center gap-1.5">
                  <Sparkles size={14} /> SIFAT GEOMETRI FORMAL
                </h3>
                <ul className="pl-1 text-xs text-slate-700 space-y-2 font-medium">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Nama Bangun:</strong> <span className="capitalize font-black text-indigo-900">{shape}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Jumlah Sisi:</strong> {shape === 'segitiga' ? '3 Ruas Sisi Lurus' : shape === 'persegi' ? '4 Sisi Sama Panjang' : '1 Garis Lengkung Kontinu'}
                    </div>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Titik Sudut:</strong> {shape === 'segitiga' ? '3 Titik Sudut' : shape === 'persegi' ? '4 Titik Sudut' : 'Tidak memiliki Titik Sudut (0)'}
                    </div>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Karakteristik Sudut:</strong> {shape === 'segitiga' ? '3 sudut lancip (masing-masing 60°), total 180°' : shape === 'persegi' ? '4 sudut siku-siku (masing-masing 90°), total 360°' : 'Sudut pusat putaran penuh (360°)'}
                    </div>
                  </li>
                </ul>
              </div>

              {/* Formula Card */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-inner space-y-3">
                <h3 className="font-black text-emerald-800 text-xs flex items-center gap-1.5">
                  <Info size={14} /> PINTAR BANGUN DATAR
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-center">
                    <div className="font-bold text-slate-500">Luas (L)</div>
                    <div className="font-mono text-sm font-black text-emerald-800 mt-1">
                      {shape === 'segitiga' && '½ × a × t'}
                      {shape === 'persegi' && 's × s'}
                      {shape === 'lingkaran' && 'π × r²'}
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-center">
                    <div className="font-bold text-slate-500">Keliling (K)</div>
                    <div className="font-mono text-sm font-black text-emerald-800 mt-1">
                      {shape === 'segitiga' && 'a + b + c'}
                      {shape === 'persegi' && '4 × s'}
                      {shape === 'lingkaran' && '2 × π × r'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Nav */}
        <div className="border-t pt-4 mt-4 flex-shrink-0">
          {phase === 'PICTORIAL' ? (
            <button
              onClick={() => handleNext('ABSTRACT')}
              className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-all bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 cursor-pointer active:scale-95"
            >
              Lanjut ke Pintar Bangun Datar →
            </button>
          ) : (
            <button
              onClick={() => handleNext('LKPD')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow active:scale-98 transition-all cursor-pointer"
            >
              Buka Evaluasi Akhir LKPD 📝
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}