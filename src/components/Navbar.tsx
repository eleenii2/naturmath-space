import { BookOpen, User, Info, ClipboardList } from 'lucide-react';
import type { LearningPhase } from '../App';
import logoNaturmath from '../assets/logo-naturmath.png';

interface NavbarProps {
  currentPhase: LearningPhase;
  setPhase: (phase: LearningPhase) => void;
  setActivePopup: (popup: any) => void;
}

export default function Navbar({ currentPhase, setPhase, setActivePopup }: NavbarProps) {
  return (
    <>
      {/* 1. Top Header Bar (Logo & Progres CPA) - Bebas dari pojok kanan atas agar tidak numpuk dengan Audio */}
      <header className="fixed top-3 left-0 w-full px-3 md:px-6 z-40 pointer-events-none font-kids select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 pointer-events-none">
          {/* Identitas Kiri */}
          <div 
            onClick={() => setPhase('WELCOME')} 
            className="pointer-events-auto flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-emerald-200 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <img src={logoNaturmath} alt="Naturmath Space Logo" className="w-7 h-7 object-contain mix-blend-multiply" style={{ mixBlendMode: 'multiply' }} />
            <div>
              <h2 className="text-xs font-black text-emerald-900 leading-none tracking-wide">NATURMATH</h2>
              <span className="text-[9px] font-bold text-orange-500 tracking-widest">SPACE</span>
            </div>
          </div>

          {/* Progres CPA */}
          <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-md border border-emerald-100 text-[11px] md:text-xs font-black text-slate-600 overflow-x-auto max-w-full">
            <button
              onClick={() => setPhase('CONCRETE')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${currentPhase === 'CONCRETE' ? 'bg-emerald-600 text-white shadow-sm font-bold scale-102' : 'hover:bg-slate-100'}`}
            >
              1. Kebun Naturmath 🏡
            </button>
            <button
              onClick={() => setPhase('PICTORIAL')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${currentPhase === 'PICTORIAL' ? 'bg-amber-500 text-white shadow-sm font-bold scale-102' : 'hover:bg-slate-100'}`}
            >
              2. Jelajah Bentuk 📱
            </button>
            <button
              onClick={() => setPhase('ABSTRACT')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${currentPhase === 'ABSTRACT' ? 'bg-indigo-600 text-white shadow-sm font-bold scale-102' : 'hover:bg-slate-100'}`}
            >
              3. Pintar Bangun Datar ✏️
            </button>
          </div>
        </div>
      </header>

      {/* 2. Floating Vertical Left Sidebar (Samping Kiri Memanjang Kebawah) */}
      <aside className="fixed top-20 left-2 md:top-22 md:left-4 z-40 flex flex-col gap-2.5 pointer-events-auto font-kids select-none max-w-[170px] md:max-w-[195px]">
        {/* 1. Tonton Apersepsi */}
        <button
          onClick={() => setActivePopup('apersepsi')}
          className="flex items-center gap-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-3 py-2.5 rounded-2xl shadow-lg border-2 border-white/80 transition-all cursor-pointer hover:translate-x-1 active:scale-95 group text-left"
          title="Tonton Video Apersepsi"
        >
          <span className="text-lg md:text-xl group-hover:scale-125 transition-transform flex-shrink-0">🎬</span>
          <div className="leading-tight min-w-0">
            <span className="block text-[9px] opacity-90 font-bold uppercase tracking-wider">Video</span>
            <span className="text-xs md:text-sm font-black truncate block">Tonton Apersepsi</span>
          </div>
        </button>

        {/* 2. Modul Guru */}
        <button
          onClick={() => setActivePopup('guru')}
          className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md hover:bg-emerald-50 text-emerald-900 px-3 py-2.5 rounded-2xl shadow-md border border-emerald-200 transition-all cursor-pointer hover:translate-x-1 active:scale-95 group text-left"
          title="Modul Guru"
        >
          <BookOpen size={18} className="text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <div className="leading-tight min-w-0">
            <span className="block text-[8px] text-emerald-600 font-bold uppercase tracking-wider">Materi</span>
            <span className="text-xs md:text-sm font-black truncate block">Modul Guru</span>
          </div>
        </button>

        {/* 3. Panduan Naturmath */}
        <button
          onClick={() => setActivePopup('tentang')}
          className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md hover:bg-amber-50 text-amber-900 px-3 py-2.5 rounded-2xl shadow-md border border-amber-200 transition-all cursor-pointer hover:translate-x-1 active:scale-95 group text-left"
          title="Panduan Naturmath"
        >
          <Info size={18} className="text-amber-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <div className="leading-tight min-w-0">
            <span className="block text-[8px] text-amber-600 font-bold uppercase tracking-wider">Informasi</span>
            <span className="text-xs md:text-sm font-black truncate block">Panduan Naturmath</span>
          </div>
        </button>

        {/* 4. Profil Pengembang */}
        <button
          onClick={() => setActivePopup('profil')}
          className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md hover:bg-indigo-50 text-indigo-900 px-3 py-2.5 rounded-2xl shadow-md border border-indigo-200 transition-all cursor-pointer hover:translate-x-1 active:scale-95 group text-left"
          title="Profil Pengembang"
        >
          <User size={18} className="text-indigo-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <div className="leading-tight min-w-0">
            <span className="block text-[8px] text-indigo-600 font-bold uppercase tracking-wider">Tim Pengembang</span>
            <span className="text-xs md:text-sm font-black truncate block">Profil Pengembang</span>
          </div>
        </button>

        {/* 5. LKPD */}
        <button
          onClick={() => setPhase('LKPD')}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl shadow-lg border-2 transition-all cursor-pointer hover:translate-x-1 active:scale-95 group text-left ${
            currentPhase === 'LKPD'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-white'
              : 'bg-white/95 backdrop-blur-md hover:bg-emerald-50 text-emerald-900 border-emerald-300'
          }`}
          title="Lembar Kerja Peserta Didik (LKPD)"
        >
          <ClipboardList size={18} className={`flex-shrink-0 ${currentPhase === 'LKPD' ? 'text-white' : 'text-emerald-600'}`} />
          <div className="leading-tight min-w-0">
            <span className={`block text-[8px] font-bold uppercase tracking-wider ${currentPhase === 'LKPD' ? 'text-emerald-200' : 'text-emerald-600'}`}>Aktivitas</span>
            <span className="text-xs md:text-sm font-black truncate block">LKPD</span>
          </div>
        </button>
      </aside>
    </>
  );
}