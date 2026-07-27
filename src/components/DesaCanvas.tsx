import { useState, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import type { LearningPhase } from '../App';
import gsap from 'gsap';
import { Raycaster, Vector2, Vector3 } from 'three';

interface CanvasProps {
  phase: LearningPhase;
  onObjectSelect: (name: string) => void;
}

export default function DesaCanvas({ phase, onObjectSelect }: CanvasProps) {
  const [hint, setHint] = useState("Arahkan kursor ke Gazebo atau Kebun untuk mencari bentuk geometri Nusantara!");
  const [loading, setLoading] = useState(true);
  const splineRef = useRef<any>(null);

  // Refs to prevent stale closures in event listeners
  const phaseRef = useRef(phase);
  const onObjectSelectRef = useRef(onObjectSelect);

  phaseRef.current = phase;
  onObjectSelectRef.current = onObjectSelect;

  // Refs untuk animasi hover pop-up
  const hoveredObjRef = useRef<any>(null);
  const originalScales = useRef<Map<any, { x: number, y: number, z: number }>>(new Map());
  const originalPositions = useRef<Map<any, { x: number, y: number, z: number }>>(new Map());
  const originalRotations = useRef<Map<any, { x: number, y: number, z: number }>>(new Map());

  // 1. Pemetaan Nama Objek dari Spline ke Kategori Bangun Datar Pembelajaran
  const objectMapping: { [key: string]: string } = {
    'Batu': 'persegi',
    'Batu persegi': 'persegi',
    'batik kebat persegi': 'persegi',
    'Atap segitiga': 'segitiga',
    'Bunga rami biru segitiga': 'segitiga',
    'Daun teratai': 'lingkaran',
  };

  // Keterangan khusus yang muncul setelah objek di-klik
  const clickExplanations: { [key: string]: string } = {
    'Batu': 'Wah! Kamu menemukan batu hiasan taman yang permukaannya datar membentuk persegi ya!',
    'Batu persegi': 'Wah! Kamu menemukan batu hiasan taman yang permukaannya datar membentuk persegi ya!',
    'batik kebat persegi': 'Wah! Kamu menemukan kain batik tradisional dengan pola geometris yang menyerupai bentuk persegi ya!',
    'Atap segitiga': 'Wah! Kamu menemukan saung/gazebo Indonesia dengan bagian atap berbentuk segitiga dan tiang-tiang kokoh!',
    'Bunga rami biru segitiga': 'Wah! Kamu menemukan kelopak bunga rami berwarna biru yang bentuknya menyerupai segitiga ya!',
    'Daun teratai': 'Wah! Kamu menemukan daun bunga teratai yang mengambang di atas air dan bentuknya bulat semacam lingkaran ya!',
  };

  // Helper untuk mencocokkan geometri secara case-insensitive
  function findGeometryCategory(name: string): string | null {
    if (!name) return null;
    const cleanName = name.toLowerCase().trim();

    for (const key of Object.keys(objectMapping)) {
      if (cleanName === key.toLowerCase()) {
        return objectMapping[key];
      }
    }
    return null;
  }

  // Helper untuk menentukan kunci penjelasan yang cocok
  function findExplanationKey(name: string): string | null {
    if (!name) return null;
    const cleanName = name.toLowerCase().trim();

    for (const key of Object.keys(objectMapping)) {
      if (cleanName === key.toLowerCase()) {
        return key;
      }
    }
    return null;
  }

  // Mengembalikan camera rig utama untuk raycasting dan pergerakan
  function getActiveCamera(splineApp: any) {
    if (!splineApp) return null;
    return splineApp._camera || splineApp.camera;
  }

  // Mendapatkan camera rig untuk melakukan pergerakan posisi (GSAP)
  function getCameraRig(splineApp: any) {
    if (!splineApp) return null;
    return splineApp._camera || splineApp.camera;
  }

  // Mendapatkan raw Three.js Object3D dari wrapper Spline dengan mencocokkan Nama Unik
  function getRawThreeObject(splineApp: any, splineObj: any) {
    if (!splineApp || !splineObj || !splineObj.name) return null;
    const sceneObj = splineApp._scene || splineApp.scene;
    if (!sceneObj) return null;

    let rawObj: any = null;
    sceneObj.traverse((child: any) => {
      if (child.name === splineObj.name && !rawObj) {
        rawObj = child;
      }
    });
    return rawObj;
  }

  // 2. Fungsi saat Model Spline Selesai Dimuat Utuh
  function onLoad(splineApp: any) {
    splineRef.current = splineApp;
    (window as any).splineApp = splineApp;
    setLoading(false);

    // Hapus logo watermark Spline dari DOM & Shadow Root secara otomatis
    const removeSplineLogo = () => {
      try {
        const watermarks = document.querySelectorAll('a[href*="spline"], #spline-watermark, .spline-watermark, [class*="watermark"], [id*="watermark"]');
        watermarks.forEach(el => el.remove());
        const container = splineApp.canvas?.parentElement;
        if (container) {
          container.querySelectorAll('a, div, span').forEach((el: any) => {
            if (el.textContent?.toLowerCase().includes('spline') || el.href?.includes('spline')) {
              el.style.display = 'none';
              el.remove();
            }
          });
        }
      } catch (e) {
        // Abaikan error proteksi elemen
      }
    };
    removeSplineLogo();
    setTimeout(removeSplineLogo, 500);
    setTimeout(removeSplineLogo, 1500);
    setTimeout(removeSplineLogo, 3000);

    // 2.1. Optimasi GPU Ekstrem Khusus Perangkat Mobile/HP agar Sangat Ringan (Anti-Lag & Anti-Bug)
    const isMobileDevice = window.innerWidth < 768 || 'ontouchstart' in window || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const renderer = splineApp._renderer || splineApp.renderer;
    if (renderer) {
      if (typeof renderer.setPixelRatio === 'function') {
        // Pada HP, batasi rasio piksel ke 1.0 agar GPU tidak terbebani rendering Retina 3x yang membuat berat/lag
        renderer.setPixelRatio(isMobileDevice ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
      }
      if (isMobileDevice && renderer.shadowMap) {
        // Matikan kalkulasi bayangan real-time di HP untuk meningkatkan frame rate hingga 60 FPS
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = false;
      }
    }

    // 2.2. Gunakan fallback Three.js Raycaster dengan penyelarasan matriks dunia kamera
    const sceneObj = splineApp._scene || splineApp.scene;
    const canvas = splineApp.canvas;
    const rawCamera = getActiveCamera(splineApp);
    const cameraRig = getCameraRig(splineApp);

    // Set posisi awal kamera dari parameter scene terbaru user
    if (cameraRig) {
      cameraRig.position.set(2610.43, 1356.27, 3437.35);
      if (splineApp._controls) {
        const controlsTarget = splineApp._controls.target || splineApp._controls.center;
        if (controlsTarget) {
          controlsTarget.set(0, 0, 0); // Atur target putaran awal ke pusat
        }
        if (typeof splineApp._controls.update === 'function') {
          splineApp._controls.update();
        }
      }
    }

    if (canvas && sceneObj && rawCamera) {
      // Pelacak posisi pointer untuk membedakan antara "Tapping Objek" vs "Dragging/Memutar Kamera" di HP
      let pointerDownX = 0;
      let pointerDownY = 0;
      canvas.addEventListener('pointerdown', (e: PointerEvent) => {
        pointerDownX = e.clientX;
        pointerDownY = e.clientY;
      }, { passive: true });

      // Raycaster Click Handler
      canvas.addEventListener('click', (e: MouseEvent) => {
        if (phaseRef.current !== 'CONCRETE') return;

        // Jika perpindahan jari saat menyentuh layar > 8px, berarti siswa sedang memutar desa 3D (dragging), abaikan klik agar tidak bug!
        if (Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY) > 8) {
          return;
        }

        const rect = canvas.getBoundingClientRect();
        const mouse = new Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        // Selaraskan matriks dunia kamera rig sebelum menembakkan raycast
        rawCamera.updateMatrixWorld(true);

        const raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, rawCamera);

        const intersects = raycaster.intersectObjects(sceneObj.children, true);
        if (intersects.length > 0) {
          let matchedObjName = "";
          let matchedThreeObj: any = null;
          let clickPoint: Vector3 | undefined = undefined;

          for (let i = 0; i < intersects.length; i++) {
            let curr: any = intersects[i].object;
            // Telusuri hierarki objek ke atas untuk menemukan objek dengan nama target geometri
            while (curr && curr !== sceneObj) {
              if (curr.name && findGeometryCategory(curr.name)) {
                matchedObjName = curr.name;
                matchedThreeObj = curr;
                clickPoint = intersects[i].point; // Dapatkan koordinat persimpangan permukaan 3D persis yang diklik
                break;
              }
              curr = curr.parent;
            }
            if (matchedObjName) {
              break;
            }
          }

          if (matchedObjName) {
            handleObjectClickByName(matchedObjName, clickPoint, matchedThreeObj);
          }
        }
      });

      // Raycaster Hover/MouseMove Handler (Hanya Aktif di Desktop! Di HP dimatikan agar tidak lag/stuttering saat geser desa)
      canvas.addEventListener('mousemove', (e: MouseEvent) => {
        if (phaseRef.current !== 'CONCRETE' || isMobileDevice) return;

        const rect = canvas.getBoundingClientRect();
        const mouse = new Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        // Selaraskan matriks dunia kamera rig sebelum menembakkan raycast
        rawCamera.updateMatrixWorld(true);

        const raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, rawCamera);

        const intersects = raycaster.intersectObjects(sceneObj.children, true);
        if (intersects.length > 0) {
          let matchedObjName = "";
          let matchedThreeObj: any = null;
          for (let i = 0; i < intersects.length; i++) {
            let curr: any = intersects[i].object;
            // Telusuri hierarki objek ke atas untuk menemukan objek dengan nama target geometri
            while (curr && curr !== sceneObj) {
              if (curr.name && findGeometryCategory(curr.name)) {
                matchedObjName = curr.name;
                matchedThreeObj = curr;
                break;
              }
              curr = curr.parent;
            }
            if (matchedObjName) {
              break;
            }
          }

          if (matchedObjName) {
            handleObjectHoverByName(matchedObjName, matchedThreeObj);
          } else {
            handleObjectHoverByName("", null);
          }
        } else {
          handleObjectHoverByName("", null);
        }
      });
    }
  }

  // 3. Logika Hover (Dengan efek pop-up skala 3D)
  function handleObjectHoverByName(objName: string, directObj?: any) {
    if (!splineRef.current) return;
    const bentukGeometri = findGeometryCategory(objName);

    if (bentukGeometri) {
      document.body.style.cursor = 'pointer';
      setHint(`Kamu menunjuk "${objName}". Apakah kamu melihat bentuk ${bentukGeometri.toUpperCase()}? Klik untuk meneliti!`);

      // Picu efek animasi skala pop-up 3D
      const targetObj = directObj || splineRef.current.findObjectByName(objName);
      if (targetObj && hoveredObjRef.current !== targetObj) {
        // Kembalikan skala, posisi, dan rotasi objek sebelumnya
        if (hoveredObjRef.current) {
          const prev = hoveredObjRef.current;
          const origS = originalScales.current.get(prev);
          if (origS) gsap.to(prev.scale, { x: origS.x, y: origS.y, z: origS.z, duration: 0.25 });

          gsap.killTweensOf(prev.position);
          gsap.killTweensOf(prev.rotation);

          const origP = originalPositions.current.get(prev);
          if (origP) gsap.to(prev.position, { x: origP.x, y: origP.y, z: origP.z, duration: 0.25 });

          const origR = originalRotations.current.get(prev);
          if (origR) gsap.to(prev.rotation, { x: origR.x, y: origR.y, z: origR.z, duration: 0.25 });
        }

        // Simpan skala asli objek baru jika belum ada
        if (!originalScales.current.has(targetObj)) {
          originalScales.current.set(targetObj, {
            x: targetObj.scale.x,
            y: targetObj.scale.y,
            z: targetObj.scale.z
          });
        }
        // Simpan posisi asli objek baru jika belum ada
        if (!originalPositions.current.has(targetObj)) {
          originalPositions.current.set(targetObj, {
            x: targetObj.position.x,
            y: targetObj.position.y,
            z: targetObj.position.z
          });
        }
        // Simpan rotasi asli objek baru jika belum ada
        if (!originalRotations.current.has(targetObj)) {
          originalRotations.current.set(targetObj, {
            x: targetObj.rotation.x,
            y: targetObj.rotation.y,
            z: targetObj.rotation.z
          });
        }

        const origS = originalScales.current.get(targetObj)!;
        hoveredObjRef.current = targetObj;

        // Skala membesar 15% (efek pop up lembut & konsisten seperti batik kebat untuk semua bangun)
        gsap.to(targetObj.scale, {
          x: origS.x * 1.15,
          y: origS.y * 1.15,
          z: origS.z * 1.15,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      }
    } else {
      // Kembalikan skala jika keluar dari objek target
      if (hoveredObjRef.current) {
        const prev = hoveredObjRef.current;
        const origS = originalScales.current.get(prev);
        if (origS) gsap.to(prev.scale, { x: origS.x, y: origS.y, z: origS.z, duration: 0.25 });

        gsap.killTweensOf(prev.position);
        gsap.killTweensOf(prev.rotation);

        const origP = originalPositions.current.get(prev);
        if (origP) gsap.to(prev.position, { x: origP.x, y: origP.y, z: origP.z, duration: 0.25 });

        const origR = originalRotations.current.get(prev);
        if (origR) gsap.to(prev.rotation, { x: origR.x, y: origR.y, z: origR.z, duration: 0.25 });

        hoveredObjRef.current = null;
      }

      if (objName) {
        document.body.style.cursor = 'default';
        setHint(`Menunjuk objek: "${objName}" (Bukan target misi geometri)`);
      } else {
        document.body.style.cursor = 'default';
        setHint("Arahkan kursor ke Gazebo atau Kebun untuk mencari bentuk geometri Nusantara!");
      }
    }
  }

  // 4. Logika Klik Objek
  function handleObjectClickByName(objName: string, clickPoint?: Vector3, directObj?: any) {
    const bentukGeometri = findGeometryCategory(objName);
    if (!bentukGeometri || !splineRef.current) return;

    // Reset animasi skala hover saat diklik
    if (hoveredObjRef.current) {
      const prev = hoveredObjRef.current;
      const origS = originalScales.current.get(prev);
      if (origS) gsap.to(prev.scale, { x: origS.x, y: origS.y, z: origS.z, duration: 0.2 });

      gsap.killTweensOf(prev.position);
      gsap.killTweensOf(prev.rotation);

      const origP = originalPositions.current.get(prev);
      if (origP) gsap.to(prev.position, { x: origP.x, y: origP.y, z: origP.z, duration: 0.2 });

      const origR = originalRotations.current.get(prev);
      if (origR) gsap.to(prev.rotation, { x: origR.x, y: origR.y, z: origR.z, duration: 0.2 });

      hoveredObjRef.current = null;
    }

    // Tampilkan penjelasan kustom di HUD atas sesuai objek yang dipilih
    const expKey = findExplanationKey(objName);
    if (expKey && clickExplanations[expKey]) {
      setHint(clickExplanations[expKey]);
    }

    const splineApp = splineRef.current;
    const cameraRig = getActiveCamera(splineApp);
    const clickedObj = directObj || splineApp.findObjectByName(objName);

    if (clickedObj && cameraRig) {
      const worldPos = new Vector3();

      if (clickPoint) {
        // Gunakan titik permukaan fisik 3D yang diklik (sangat presisi)
        worldPos.copy(clickPoint);
      } else {
        // Fallback jika tidak diklik langsung (misal via debug menu)
        const rawThreeObj = getRawThreeObject(splineApp, clickedObj);
        if (rawThreeObj && typeof rawThreeObj.getWorldPosition === 'function') {
          rawThreeObj.getWorldPosition(worldPos);
        } else {
          worldPos.set(clickedObj.position.x, clickedObj.position.y, clickedObj.position.z);
        }
      }

      // DIAGNOSTIC LOG UNTUK MEMVERIFIKASI KOORDINAT DUNIA ASLI (Hanya di console, tidak mengganggu UI)
      console.log(`clickedObj: ${objName}`, `zoomTarget: x=${worldPos.x.toFixed(1)}, y=${worldPos.y.toFixed(1)}, z=${worldPos.z.toFixed(1)}`, clickPoint ? "using raw raycast clickPoint" : "");

      // AMANKAN CONTROLS TARGET (OrbitControls / Spline Controls)
      if (splineApp._controls) {
        const controlsTarget = splineApp._controls.target || splineApp._controls.center;
        if (controlsTarget) {
          gsap.to(controlsTarget, {
            x: worldPos.x,
            y: worldPos.y,
            z: worldPos.z,
            duration: 1.8,
            ease: 'power2.out'
          });
        }
      }

      // Animasi kamera rig meluncur mulus ke arah koordinat klik objek
      gsap.to(cameraRig.position, {
        x: worldPos.x + 400,
        y: worldPos.y + 600,
        z: worldPos.z + 1200,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          if (splineApp._controls && typeof splineApp._controls.update === 'function') {
            splineApp._controls.update();
          } else if (cameraRig.lookAt) {
            cameraRig.lookAt(worldPos);
          }
        },
        onComplete: () => {
          // Pindahkan alur belajar setelah 800ms agar siswa sempat membaca penjelasan kustom di HUD
          setTimeout(() => {
            onObjectSelectRef.current(objName);
          }, 800);
        }
      });
    }
  }

  // URL scene Spline asli tanpa query parameters (karena query string merusak ekstensi parser di loader)
  const cleanSceneUrl = "https://prod.spline.design/Ukew8GweoIZPdB4a/scene.splinecode";

  return (
    <div className="w-full h-full relative bg-[#6fe7d4]">
      {/* HUD Info Teks Petunjuk Pembelajaran - Adaptif mobile (lebih ringkas & posisi pas) & desktop */}
      <div className="absolute top-18 md:top-24 left-1/2 transform -translate-x-1/2 z-30 text-center pointer-events-none w-11/12 max-w-xl">
        <div className="bg-slate-900/85 text-emerald-400 border border-emerald-500/30 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-2.5 rounded-full font-bold shadow-2xl text-[10px] md:text-sm tracking-wide font-sans">
          {hint}
        </div>
      </div>

      {/* Shimmer Shading Efek Loading Screen untuk Anak SD */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500 to-emerald-600 flex flex-col items-center justify-center z-40 p-4 space-y-4">
          <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center text-white font-bold tracking-wide space-y-1">
            <p className="text-sm md:text-base font-black">Memanggil Desa Belajar Nusantara 3D...</p>
            <p className="text-[10px] md:text-xs opacity-80">Dibuat dengan teknologi 3D interaktif realistik</p>
            <div className="inline-block mt-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] text-amber-300 border border-amber-400/40 shadow-sm">
              ⚡ Mode Cepat HP Aktif (Anti-Lag & Hemat Kuota)
            </div>
          </div>
        </div>
      )}

      {/* RENDER UTAMA EMBED SCENE SPLINE INDONESIA */}
      <Spline
        scene={cleanSceneUrl}
        onLoad={onLoad}
        className="w-full h-full"
      />

      {/* Penutup / Blocker Logo Spline di Pojok Kanan Bawah - Adaptif untuk mobile (di atas dock menu bottom-14) & desktop */}
      <div className="absolute bottom-16 md:bottom-2 right-2 z-30 min-w-[190px] md:min-w-[260px] h-11 md:h-14 bg-white/95 backdrop-blur-xl px-3.5 md:px-5 py-1.5 md:py-2 rounded-2xl border-2 border-emerald-400 shadow-[0_4px_25px_rgba(16,185,129,0.3)] pointer-events-none flex items-center justify-center gap-2 md:gap-3 select-none">
        <span className="text-base md:text-2xl animate-bounce" style={{ animationDuration: '3s' }}>🌿</span>
        <div className="flex flex-col text-left leading-none">
          <span className="text-xs md:text-base font-black text-emerald-950 tracking-wider">NATURMATH SPACE 3D</span>
          <span className="text-[9px] md:text-xs font-extrabold text-amber-600 uppercase tracking-widest mt-0.5">Media Belajar Geometri</span>
        </div>
      </div>
    </div>
  );
}