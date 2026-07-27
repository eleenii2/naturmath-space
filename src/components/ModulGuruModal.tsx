import { X, Download, ExternalLink, FileText } from 'lucide-react';
import modulAjarPdf from '../assets/Modul Ajar.pdf';

interface ModulGuruModalProps {
  onClose: () => void;
}

export default function ModulGuruModal({ onClose }: ModulGuruModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md font-sans animate-fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-5xl h-[90vh] border-4 border-emerald-500 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* 1. Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-5 py-4 flex flex-wrap justify-between items-center gap-3 border-b-4 border-emerald-800 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm text-2xl md:text-3xl shadow-inner">👨‍🏫</div>
            <div>
              <h2 className="font-black text-lg md:text-2xl tracking-wide uppercase drop-shadow-sm leading-tight">
                MODUL AJAR & RUANG GURU
              </h2>
              <p className="text-xs md:text-sm font-bold text-emerald-100">
                Perangkat Pembelajaran Matematika SD Terintegrasi AR & Budaya Nusantara
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <a
              href={modulAjarPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition backdrop-blur-sm border border-white/30"
              title="Buka PDF di Tab Baru"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Buka Layar Penuh</span>
            </a>
            <a
              href={modulAjarPdf}
              download="Modul Ajar - NaturMath Space.pdf"
              className="flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 px-4 py-2.5 rounded-xl font-black text-xs md:text-sm shadow-md transition cursor-pointer border border-emerald-200"
              title="Unduh Modul Ajar PDF"
            >
              <Download size={16} className="text-emerald-600 animate-bounce" />
              <span>Download Modul (PDF)</span>
            </a>
            <button
              onClick={onClose}
              className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white p-2.5 rounded-full shadow-md transition cursor-pointer flex-shrink-0 ml-1"
              title="Tutup Ruang Guru"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100 flex flex-col gap-4">
          
          {/* Info Card Bar */}
          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 flex-shrink-0">
            <div className="flex items-start md:items-center gap-3">
              <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl font-black text-xl flex-shrink-0 mt-0.5 md:mt-0">
                📑
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm md:text-base flex items-center gap-2">
                  <span>Modul Ajar Matematika - Fase B (Kelas IV SD)</span>
                  <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Kurikulum Merdeka</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Disusun berdasarkan sintaks <strong>NaturMath Space</strong> (CPA & Eksplorasi Lingkungan) untuk memandu proses Belajar Mengajar Geometri yang interaktif.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 flex-shrink-0 self-stretch md:self-auto justify-center">
              <FileText size={16} className="text-emerald-600" />
              <span>Berkas PDF Aktif • Siap Pakai</span>
            </div>
          </div>

          {/* Embedded PDF Viewer Container */}
          <div className="flex-1 w-full min-h-[500px] bg-white rounded-3xl overflow-hidden border-2 border-slate-300 shadow-md relative flex flex-col">
            <div className="bg-slate-800 text-slate-200 px-4 py-2 text-xs font-bold flex justify-between items-center border-b border-slate-700 flex-shrink-0">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                Tampilan Pratinjau Dokumen PDF Modul Ajar
              </span>
              <span className="text-slate-400">Gunakan tombol + / - pada viewer untuk memperbesar</span>
            </div>
            
            {/* Iframe PDF Viewer */}
            <iframe
              src={`${modulAjarPdf}#toolbar=1&navpanes=1&view=FitH`}
              title="Modul Ajar NaturMath Space PDF"
              className="w-full h-full flex-1 border-0 min-h-[500px]"
            >
              <div className="p-8 text-center space-y-4">
                <p className="text-slate-600 font-medium">Browser Anda tidak mendukung pratinjau PDF langsung di dalam halaman.</p>
                <a
                  href={modulAjarPdf}
                  download="Modul Ajar - NaturMath Space.pdf"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl shadow"
                >
                  <Download size={18} /> Download Modul Ajar PDF
                </a>
              </div>
            </iframe>
          </div>

        </div>

        {/* 3. Footer Info */}
        <div className="bg-white px-6 py-3 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs font-bold text-slate-400 flex-shrink-0 gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> 
            Modul Ajar Guru NaturMath Space • Integrasi Pendekatan CPA & AR
          </span>
          <span>PGSD UPI Purwakarta • Versi 2026</span>
        </div>

      </div>
    </div>
  );
}
