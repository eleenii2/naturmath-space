import { useState } from 'react';
import { X, Download, CheckCircle2, Sparkles, Award } from 'lucide-react';

interface PanduanModalProps {
  onClose: () => void;
}

const chapters = [
  { id: 'bab1', title: 'Bab I: Pendahuluan', icon: '📌', subtitle: 'Latar Belakang & Tujuan' },
  { id: 'bab2', title: 'Bab II: Mengenal NaturMath', icon: '🌿', subtitle: 'Konsep & Keunggulan' },
  { id: 'bab3', title: 'Bab III: Tujuan Media', icon: '🎯', subtitle: 'Manfaat Penggunaan' },
  { id: 'bab4', title: 'Bab IV: Capaian & Tujuan', icon: '🏆', subtitle: 'Target Pembelajaran' },
  { id: 'bab5', title: 'Bab V: Sintaks NaturMath', icon: '🔄', subtitle: 'Integrasi Fase Belajar' },
  { id: 'bab6', title: 'Bab VI: Persiapan Guru', icon: '📋', subtitle: 'Checklist Kelengkapan' },
  { id: 'bab7', title: 'Bab VII: Panduan Website', icon: '💻', subtitle: 'Langkah 1 - 9 Penggunaan' },
  { id: 'bab8', title: 'Bab VIII: Panduan AR', icon: '📱', subtitle: 'Langkah Scan 3D / AR' },
  { id: 'bab9', title: 'Bab IX: Alur Belajar', icon: '🗺️', subtitle: 'Skema Tahapan KBM' },
  { id: 'bab10', title: 'Bab X: Penutup', icon: '🏁', subtitle: 'Kesimpulan Akhir' },
];

export default function PanduanModal({ onClose }: PanduanModalProps) {
  const [activeTab, setActiveTab] = useState('bab1');

  const handleDownloadClick = () => {
    alert("📋 Berkas Buku Panduan NaturMath Space (PDF) saat ini sedang dipersiapkan untuk diunggah ke dalam sistem aset. Fitur unduhan akan segera aktif setelah berkas dimasukkan!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/80 backdrop-blur-md font-sans animate-fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-6xl h-[92vh] border-4 border-amber-500 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* 1. Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-5 py-4 flex flex-wrap justify-between items-center gap-3 border-b-4 border-amber-600 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm text-2xl md:text-3xl shadow-inner">📚</div>
            <div>
              <h2 className="font-black text-lg md:text-2xl tracking-wide uppercase drop-shadow-sm leading-tight">
                BUKU PANDUAN NATURMATH SPACE
              </h2>
              <p className="text-xs md:text-sm font-bold text-amber-100">
                Media Pembelajaran Geometri SD Terintegrasi AR & Budaya Nusantara
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={handleDownloadClick}
              className="flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 active:scale-95 px-4 py-2.5 rounded-xl font-black text-xs md:text-sm shadow-md transition cursor-pointer border border-amber-200"
              title="Unduh Buku Panduan PDF"
            >
              <Download size={16} className="text-amber-600 animate-bounce" />
              <span>Download Panduan (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white p-2.5 rounded-full shadow-md transition cursor-pointer flex-shrink-0"
              title="Tutup Panduan"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 2. Main Body (Presisi Sidebar + Content Area) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
          
          {/* Chapter Navigation Sidebar (Dibuat Lebar 80 / 320px Agar Judul Presisi Tidak Terpotong) */}
          <aside className="w-full md:w-72 lg:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex md:flex-col overflow-x-auto md:overflow-y-auto p-2.5 md:p-3.5 gap-2 flex-shrink-0 shadow-sm">
            <div className="hidden md:flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 border-b border-slate-100 mb-1">
              <span>Daftar Isi Panduan</span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px]">10 Bab</span>
            </div>
            {chapters.map((chap) => {
              const isActive = activeTab === chap.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => setActiveTab(chap.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs md:text-sm text-left whitespace-nowrap md:whitespace-normal transition-all cursor-pointer border-l-4 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-102 border-white pl-4'
                      : 'text-slate-700 hover:bg-amber-50 hover:text-amber-950 border-transparent hover:border-amber-400'
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{chap.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-black leading-snug">{chap.title}</span>
                    <span className={`block text-[10px] truncate ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>
                      {chap.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Chapter Content Display (Area Baca Luas & Presisi) */}
          <main className="flex-1 overflow-y-auto p-5 md:p-10 text-slate-700 leading-relaxed space-y-7 bg-slate-50/70">
            
            {/* BAB I: PENDAHULUAN */}
            {activeTab === 'bab1' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab I</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">PENDAHULUAN</h3>
                  </div>
                  <span className="text-3xl">📌</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <h4 className="font-black text-amber-950 flex items-center gap-2.5 text-lg border-b pb-2">
                    <span className="text-xl">🌱</span> A. Latar Belakang
                  </h4>
                  <p className="text-sm md:text-base text-slate-600 text-justify leading-relaxed">
                    Pembelajaran matematika pada jenjang sekolah dasar perlu memberikan pengalaman belajar yang konkret agar peserta didik lebih mudah memahami konsep abstrak. Salah satu konsep yang membutuhkan visualisasi adalah bangun datar. <strong>NaturMath Space</strong> dikembangkan sebagai media pembelajaran digital yang mengintegrasikan website interaktif dan teknologi <em>Augmented Reality (AR)</em> sehingga peserta didik dapat mengamati berbagai objek nyata yang memiliki bentuk bangun datar.
                  </p>
                  <p className="text-sm md:text-base text-slate-600 text-justify leading-relaxed">
                    Media ini dirancang untuk mendukung pembelajaran yang aktif, bermakna, dan menyenangkan melalui sintaks NaturMath.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200/80 shadow-sm space-y-4">
                  <h4 className="font-black text-amber-950 flex items-center gap-2.5 text-lg border-b border-amber-200 pb-2">
                    <span className="text-xl">🎯</span> B. Tujuan Buku Panduan
                  </h4>
                  <p className="text-sm md:text-base text-slate-700 font-medium">Buku ini bertujuan membantu guru untuk:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm font-bold text-slate-800">
                    <div className="bg-white/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-2xs border border-amber-100">
                      <CheckCircle2 size={18} className="text-amber-600 flex-shrink-0" />
                      <span>Memahami konsep NaturMath Space</span>
                    </div>
                    <div className="bg-white/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-2xs border border-amber-100">
                      <CheckCircle2 size={18} className="text-amber-600 flex-shrink-0" />
                      <span>Mengetahui fungsi setiap fitur website</span>
                    </div>
                    <div className="bg-white/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-2xs border border-amber-100">
                      <CheckCircle2 size={18} className="text-amber-600 flex-shrink-0" />
                      <span>Melaksanakan pembelajaran sesuai sintaks NaturMath</span>
                    </div>
                    <div className="bg-white/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-2xs border border-amber-100">
                      <CheckCircle2 size={18} className="text-amber-600 flex-shrink-0" />
                      <span>Menggunakan fitur AR secara optimal</span>
                    </div>
                    <div className="bg-white/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-2xs border border-amber-100 sm:col-span-2">
                      <CheckCircle2 size={18} className="text-amber-600 flex-shrink-0" />
                      <span>Mengintegrasikan media dengan modul ajar kelas IV SD</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BAB II: MENGENAL NATURMATH SPACE */}
            {activeTab === 'bab2' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab II</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">MENGENAL NATURMATH SPACE</h3>
                  </div>
                  <span className="text-3xl">🌿</span>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <h4 className="font-black text-emerald-950 text-xl flex items-center gap-2.5">
                    <span>💡</span> Apa itu NaturMath Space?
                  </h4>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed text-justify">
                    <strong>NaturMath Space</strong> merupakan media pembelajaran interaktif berbasis website yang dipadukan dengan teknologi <em>Augmented Reality (AR)</em> untuk membantu peserta didik memahami konsep bangun datar melalui eksplorasi alam dan budaya Indonesia.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-5">
                  <h4 className="font-black text-lg md:text-xl flex items-center gap-2.5">
                    <Sparkles className="text-yellow-300 flex-shrink-0" size={24} /> 
                    <span>Media ini memungkinkan peserta didik:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-bold text-sm md:text-base">
                    {[
                      "Belajar melalui permainan seru",
                      "Mengamati objek 3D secara nyata",
                      "Melihat bentuk dari berbagai sudut",
                      "Mempelajari sifat bangun datar",
                      "Mempelajari rumus sederhana",
                      "Mengerjakan kuis evaluasi interaktif"
                    ].map((feat, idx) => (
                      <div key={idx} className="bg-white/15 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 border border-white/20 shadow-sm">
                        <span className="bg-yellow-400 text-slate-950 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BAB III: TUJUAN PENGGUNAAN MEDIA */}
            {activeTab === 'bab3' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab III</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">TUJUAN PENGGUNAAN MEDIA</h3>
                  </div>
                  <span className="text-3xl">🎯</span>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                  <h4 className="font-black text-indigo-950 text-base md:text-lg">
                    Penggunaan NaturMath Space bertujuan untuk membantu peserta didik agar mampu:
                  </h4>
                  <div className="space-y-3 pl-1 text-sm md:text-base text-slate-700">
                    {[
                      "Mengenali berbagai bentuk bangun datar di lingkungan sekitar secara presisi.",
                      "Mengidentifikasi unsur dan sifat bangun datar secara tepat.",
                      "Memvisualisasikan bangun datar melalui objek tiga dimensi berbasis Augmented Reality (AR).",
                      "Menghubungkan konsep matematika dengan alam dan budaya Indonesia.",
                      "Menerapkan konsep bangun datar dalam pemecahan masalah kehidupan sehari-hari."
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3.5 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
                        <span className="bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 shadow-2xs">{idx + 1}</span>
                        <span className="font-semibold text-slate-800 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 p-6 rounded-3xl border border-amber-300 text-slate-900 text-sm md:text-base font-medium flex items-center gap-4 shadow-sm">
                  <span className="text-4xl flex-shrink-0">💡</span>
                  <p className="leading-relaxed">
                    Selain itu, media ini membantu guru dalam menciptakan pembelajaran yang lebih <strong>interaktif, kontekstual, dan sesuai dengan karakteristik</strong> peserta didik sekolah dasar.
                  </p>
                </div>
              </div>
            )}

            {/* BAB IV: CAPAIAN & TUJUAN PEMBELAJARAN */}
            {activeTab === 'bab4' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab IV</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">CAPAIAN & TUJUAN PEMBELAJARAN</h3>
                  </div>
                  <span className="text-3xl">🏆</span>
                </div>

                <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4">
                  <h4 className="font-black text-yellow-300 text-lg md:text-xl flex items-center gap-2.5 border-b border-white/20 pb-3">
                    <Award size={24} className="flex-shrink-0" /> 
                    <span>Capaian Pembelajaran (Fase B - Kelas IV SD)</span>
                  </h4>
                  <p className="text-sm md:text-base text-blue-100 leading-relaxed text-justify">
                    Pada akhir fase B, peserta didik mampu mengenali dan mendeskripsikan ciri-ciri berbagai bangun datar sederhana seperti <strong>persegi, persegi panjang, segitiga, dan lingkaran</strong> berdasarkan jumlah sisi, jumlah sudut, serta karakteristik bentuknya.
                  </p>
                  <p className="text-sm md:text-base text-blue-100 leading-relaxed text-justify">
                    Peserta didik juga mampu menemukan contoh bangun datar pada benda di lingkungan sekitar dan menghubungkannya dengan situasi kehidupan sehari-hari.
                  </p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                  <h4 className="font-black text-slate-900 text-base md:text-lg border-b pb-3">
                    🎯 Tujuan Pembelajaran Melalui NaturMath Space:
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500 font-bold">Setelah mengikuti pembelajaran menggunakan NaturMath Space, peserta didik mampu:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Mengidentifikasi bentuk bangun datar pada benda di lingkungan sekitar.",
                      "Menghubungkan objek alam dengan konsep bangun datar.",
                      "Mengamati representasi objek tiga dimensi menggunakan teknologi AR.",
                      "Menjelaskan pengertian dan sifat bangun datar.",
                      "Menggunakan rumus sederhana sesuai materi yang dipelajari.",
                      "Menyelesaikan latihan dan kuis secara mandiri.",
                      "Merefleksikan hasil pembelajaran yang telah dilakukan."
                    ].map((tujuan, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3 text-xs md:text-sm font-bold text-slate-800 shadow-2xs hover:border-emerald-300 transition">
                        <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-2xs">{idx + 1}</span>
                        <span className="leading-snug">{tujuan}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BAB V: SINTAKS PEMBELAJARAN NATURMATH */}
            {activeTab === 'bab5' && (
              <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab V</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">SINTAKS PEMBELAJARAN NATURMATH</h3>
                  </div>
                  <span className="text-3xl">🔄</span>
                </div>

                <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200/80 shadow-md overflow-hidden space-y-4">
                  <p className="text-sm md:text-base text-slate-600">
                    Berikut adalah integrasi tahapan (sintaks) model pembelajaran NaturMath dengan aktivitas guru dan fitur interaktif pada media NaturMath Space:
                  </p>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs md:text-sm uppercase tracking-wider">
                          <th className="p-4 font-black w-1/4">Fase Sintaks</th>
                          <th className="p-4 font-black w-1/2">Aktivitas Guru</th>
                          <th className="p-4 font-black w-1/4">Fitur NaturMath Space</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs md:text-sm font-medium">
                        <tr className="hover:bg-amber-50/60 transition">
                          <td className="p-4 font-black text-emerald-800 bg-emerald-50/40">1. Nature Exploration</td>
                          <td className="p-4 text-slate-700">Mengajak peserta didik mengamati lingkungan sekitar</td>
                          <td className="p-4"><span className="bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl font-black border border-emerald-300 block text-center shadow-2xs">🏡 Eksplorasi Alam</span></td>
                        </tr>
                        <tr className="hover:bg-amber-50/60 transition">
                          <td className="p-4 font-black text-amber-800 bg-amber-50/40">2. Contextualization</td>
                          <td className="p-4 text-slate-700">Menghubungkan objek dengan kehidupan sehari-hari</td>
                          <td className="p-4"><span className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl font-black border border-amber-300 block text-center shadow-2xs">📱 Jelajah Sekitar</span></td>
                        </tr>
                        <tr className="hover:bg-amber-50/60 transition">
                          <td className="p-4 font-black text-sky-800 bg-sky-50/40">3. Visual Representation</td>
                          <td className="p-4 text-slate-700">Menggunakan objek 3D dan AR</td>
                          <td className="p-4"><span className="bg-sky-100 text-sky-900 px-3 py-1.5 rounded-xl font-black border border-sky-300 block text-center shadow-2xs">🧊 Lihat Bentuk 3D</span></td>
                        </tr>
                        <tr className="hover:bg-amber-50/60 transition">
                          <td className="p-4 font-black text-indigo-800 bg-indigo-50/40">4. Mathematical Abstraction</td>
                          <td className="p-4 text-slate-700">Menyimpulkan konsep bangun datar</td>
                          <td className="p-4"><span className="bg-indigo-100 text-indigo-900 px-3 py-1.5 rounded-xl font-black border border-indigo-300 block text-center shadow-2xs">✏️ Pahami Bentuk</span></td>
                        </tr>
                        <tr className="hover:bg-amber-50/60 transition">
                          <td className="p-4 font-black text-purple-800 bg-purple-50/40">5. Mathematical Application</td>
                          <td className="p-4 text-slate-700">Mengerjakan latihan dan tantangan</td>
                          <td className="p-4"><span className="bg-purple-100 text-purple-900 px-3 py-1.5 rounded-xl font-black border border-purple-300 block text-center shadow-2xs">🎯 Tantangan Matematika</span></td>
                        </tr>
                        <tr className="hover:bg-amber-50/60 transition">
                          <td className="p-4 font-black text-rose-800 bg-rose-50/40">6. Reflection</td>
                          <td className="p-4 text-slate-700">Melakukan refleksi pengalaman belajar</td>
                          <td className="p-4"><span className="bg-rose-100 text-rose-900 px-3 py-1.5 rounded-xl font-black border border-rose-300 block text-center shadow-2xs">📖 Cerita Belajarku</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* BAB VI: PERSIAPAN GURU */}
            {activeTab === 'bab6' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab VI</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">PERSIAPAN GURU</h3>
                  </div>
                  <span className="text-3xl">📋</span>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                  <p className="text-sm md:text-base text-slate-600 font-medium">
                    Sebelum pembelajaran dimulai, guru perlu memastikan kelengkapan teknis dan pedagogis berikut ini agar KBM berjalan lancar:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {[
                      "Laptop atau komputer tersedia dan berfungsi baik",
                      "LCD proyektor tersedia untuk presentasi kelas",
                      "Smartphone memiliki Google Lens atau pemindai QR",
                      "Jaringan internet stabil (WiFi/Tethering)",
                      "QR Code AR dapat dipindai dengan jelas",
                      "LKPD (Lembar Kerja) telah dibagikan ke siswa",
                      "Peserta didik memahami aturan penggunaan perangkat"
                    ].map((item, idx) => (
                      <div key={idx} className="bg-emerald-50/80 border-2 border-emerald-200/80 p-4 rounded-2xl flex items-center gap-3.5 font-bold text-slate-800 text-sm shadow-2xs">
                        <div className="bg-emerald-500 text-white p-1.5 rounded-full flex-shrink-0 shadow-2xs">
                          <CheckCircle2 size={18} />
                        </div>
                        <span className="leading-snug">✓ {item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BAB VII: PANDUAN PENGGUNAAN WEBSITE */}
            {activeTab === 'bab7' && (
              <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab VII</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">PANDUAN PENGGUNAAN WEBSITE</h3>
                  </div>
                  <span className="text-3xl">💻</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { step: "1", title: "Membuka Website", desc: "Masukkan alamat website NaturMath Space menggunakan browser di laptop atau tablet." },
                    { step: "2", title: "Landing Page", desc: "Guru mengenalkan karakter NaturMath serta tujuan pembelajaran, lalu klik tombol 'Mulai Petualangan' / 'Mulai Belajar'." },
                    { step: "3", title: "Kebun Naturmath", desc: "Peserta didik mencari benda di kebun virtual 3D yang memiliki bentuk bangun datar." },
                    { step: "4", title: "Jelajah Bentuk", desc: "Peserta didik menghubungkan benda alam dan budaya tersebut dengan konsep geometri bangun datar." },
                    { step: "5", title: "Lihat Bentuk 3D / AR", desc: "Klik salah satu objek agar membesar dan berputar. Klik kembali untuk memilih 'Lihat dalam AR' atau 'Lihat Objek 3D'." },
                    { step: "6", title: "Scan AR", desc: "Klik 'Lihat dalam AR' untuk memunculkan QR Code. Peserta didik membuka Google Lens lalu memindai kode tersebut agar objek 3D muncul di atas meja." },
                    { step: "7", title: "Informasi Geometri", desc: "Saat objek muncul, peserta didik membaca Pengertian, Jumlah sisi, Jumlah sudut, Sifat bangun datar, dan Contoh nyata." },
                    { step: "8", title: "Pahami Bentuk", desc: "Pada menu ini peserta didik mempelajari Kesimpulan materi, Rumus sederhana, dan Ringkasan sifat bangun datar." },
                    { step: "9", title: "Tantangan Matematika", desc: "Peserta didik mengerjakan latihan soal sederhana dan kuis evaluasi secara mandiri." }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition">
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                          <span className="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-2xs">Langkah {item.step}</span>
                          <span className="text-amber-600 font-bold text-xs">NaturMath Space</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-base mb-2">{item.title}</h4>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BAB VIII: PANDUAN AUGMENTED REALITY (AR) */}
            {activeTab === 'bab8' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab VIII</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">PANDUAN AUGMENTED REALITY (AR)</h3>
                  </div>
                  <span className="text-3xl">📱</span>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                  <p className="text-sm md:text-base text-slate-600 font-medium">
                    Ikuti 7 langkah mudah berikut untuk mengaktifkan dan mengamati objek 3D di atas meja atau ruangan kelas menggunakan teknologi <em>Augmented Reality (AR)</em>:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { step: "1", label: "Klik Objek 3D", detail: "Pilih objek alam atau budaya yang ingin diamati di layar." },
                      { step: "2", label: "Klik Lihat dalam AR", detail: "Tekan tombol menu 'Lihat dalam AR' pada jendela pop-up." },
                      { step: "3", label: "Scan QR Google Lens", detail: "Arahkan kamera smartphone dengan Google Lens ke QR Code." },
                      { step: "4", label: "Objek 3D Muncul", detail: "Objek akan muncul di layar smartphone secara nyata." },
                      { step: "5", label: "Amati Objek Nyata", detail: "Putar dan perbesar objek dari berbagai sudut arah." },
                      { step: "6", label: "Baca Penjelasan", detail: "Cermati sifat, sisi, dan sudut bangun datar yang muncul." },
                      { step: "7", label: "Diskusikan Bersama", detail: "Lakukan diskusi aktif bersama kelompok belajar di kelas." }
                    ].map((st, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border-2 border-indigo-200/80 p-4 rounded-2xl flex flex-col justify-between shadow-2xs relative overflow-hidden group hover:border-indigo-400 transition">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white font-black text-xs px-3 py-1 rounded-bl-2xl">
                          Step {st.step}
                        </div>
                        <div className="mt-4">
                          <h5 className="font-black text-indigo-950 text-base mb-1">{st.label}</h5>
                          <p className="text-xs text-slate-600 leading-snug">{st.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BAB IX: ALUR PEMBELAJARAN */}
            {activeTab === 'bab9' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab IX</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">ALUR PEMBELAJARAN</h3>
                  </div>
                  <span className="text-3xl">🗺️</span>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white p-6 md:p-10 rounded-3xl shadow-xl space-y-6">
                  <div className="text-center max-w-2xl mx-auto">
                    <h4 className="font-black text-xl md:text-2xl text-yellow-300 uppercase tracking-wide">
                      Skema Alur Kegiatan Belajar Mengajar
                    </h4>
                    <p className="text-xs md:text-sm text-emerald-100 mt-1">
                      Tahapan berurutan dan sistematis dalam menggunakan media NaturMath Space
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {[
                      { num: "1", name: "Eksplorasi Alam", icon: "🏡" },
                      { num: "2", name: "Menghubungkan Kehidupan", icon: "📱" },
                      { num: "3", name: "Melihat Objek 3D", icon: "🧊" },
                      { num: "4", name: "Mengamati AR", icon: "📱" },
                      { num: "5", name: "Memahami Konsep", icon: "✏️" },
                      { num: "6", name: "Mengerjakan Tantangan", icon: "🎯" },
                      { num: "7", name: "Refleksi Pembelajaran", icon: "📖" }
                    ].map((alur, idx) => (
                      <div key={idx} className="bg-white/15 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-white/25 shadow-md relative group hover:bg-white/25 transition">
                        <span className="bg-yellow-400 text-slate-950 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-2xs">
                          {alur.num}
                        </span>
                        <span className="text-2xl mt-1">{alur.icon}</span>
                        <span className="font-black text-sm leading-snug">{alur.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BAB X: PENUTUP */}
            {activeTab === 'bab10' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="border-b-2 border-amber-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md">Bab X</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">PENUTUP</h3>
                  </div>
                  <span className="text-3xl">🏁</span>
                </div>

                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-8 md:p-12 rounded-3xl border-2 border-amber-300 shadow-sm space-y-6 text-center">
                  <div className="text-5xl md:text-6xl animate-bounce">🌟</div>
                  <h4 className="font-black text-amber-950 text-xl md:text-2xl">
                    Mewujudkan Pembelajaran Geometri yang Bermakna
                  </h4>
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-3xl mx-auto text-justify sm:text-center">
                    <strong>NaturMath Space</strong> dirancang sebagai media pembelajaran yang mengintegrasikan eksplorasi lingkungan, budaya Indonesia, teknologi digital, dan pembelajaran matematika. Dengan memanfaatkan website serta <em>Augmented Reality</em>, guru dapat menciptakan pengalaman belajar yang lebih konkret, interaktif, dan bermakna sehingga peserta didik tidak hanya menghafal konsep bangun datar, tetapi juga memahami penerapannya dalam kehidupan sehari-hari.
                  </p>
                  <div className="pt-6 border-t-2 border-amber-200/80 text-xs md:text-sm font-black text-amber-800 uppercase tracking-wider">
                    Tim Pengembangan KBK Matematika PGSD UPI Kampus Purwakarta
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* 3. Footer Info */}
        <div className="bg-white px-6 py-3 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs font-bold text-slate-400 flex-shrink-0 gap-2">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Buku Panduan Penggunaan NaturMath Space • E-Book Resmi</span>
          <span>Versi 2026 • PGSD UPI Purwakarta</span>
        </div>

      </div>
    </div>
  );
}
