import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Center, Html } from '@react-three/drei';
import { RotateCw, Compass } from 'lucide-react';

// Loader component for Suspense fallback
function ModelLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-slate-800 font-sans font-bold bg-white/95 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 text-[11px] gap-2 whitespace-nowrap">
        <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Memuat Aset 3D Nusantara...</span>
      </div>
    </Html>
  );
}

// Model component to load GLB assets
function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Procedural Batu (Square block)
function ProceduralBatu() {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.35, 1.8]} />
      <meshStandardMaterial color="#8a9597" roughness={0.85} metalness={0.15} />
    </mesh>
  );
}

// Procedural Bunga Rami Biru (5-petal flax flower — realistic)
function ProceduralBunga() {
  return (
    <group>
      {/* Stem */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 1.2, 8]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.7} />
      </mesh>

      {/* Small leaves on stem */}
      {[0.3, -0.2].map((yPos, i) => (
        <group key={`leaf-${i}`} position={[0, yPos - 0.5, 0]} rotation={[0, 0, i === 0 ? 0.5 : -0.5]}>
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.25, 0.03, 0.08]} />
            <meshStandardMaterial color="#40916c" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Flower head group — slightly tilted to show face */}
      <group position={[0, 0.05, 0]} rotation={[-0.25, 0, 0]}>
        {/* 5 Petals — triangular shape (segitiga), flat, blue */}
        {[0, 72, 144, 216, 288].map((angle, index) => (
          <group key={`petal-${index}`} rotation={[0, 0, (angle * Math.PI) / 180]}>
            <mesh position={[0, 0.45, 0.02]} rotation={[0.15, 0, 0]} scale={[1, 1, 0.18]}>
              <coneGeometry args={[0.38, 0.78, 3]} />
              <meshStandardMaterial
                color="#4A90D9"
                roughness={0.45}
                metalness={0.05}
                transparent
                opacity={0.92}
                emissive="#1a5276"
                emissiveIntensity={0.15}
              />
            </mesh>
            {/* Petal vein line (subtle triangular center line) */}
            <mesh position={[0, 0.42, 0.06]} rotation={[0.15, 0, 0]} scale={[0.03, 0.4, 0.01]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#2e6da4" roughness={0.8} transparent opacity={0.4} />
            </mesh>
          </group>
        ))}

        {/* Flower center — yellow pistil/stamen cluster */}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#f7dc6f" roughness={0.35} emissive="#d4ac0d" emissiveIntensity={0.3} />
        </mesh>
        {/* Inner ring of tiny stamens */}
        {[0, 60, 120, 180, 240, 300].map((ang, i) => (
          <mesh key={`stamen-${i}`}
            position={[
              0.08 * Math.cos((ang * Math.PI) / 180),
              0.08 * Math.sin((ang * Math.PI) / 180),
              0.12
            ]}
          >
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#f39c12" roughness={0.5} emissive="#e67e22" emissiveIntensity={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Procedural Daun Teratai (Circular concept with a V-cut)
function ProceduralTeratai() {
  return (
    <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      {/* Cylinder with a missing sector (V-cut) representing lotus leaf */}
      <cylinderGeometry args={[1.2, 1.2, 0.05, 32, 1, false, 0.3, 2 * Math.PI - 0.6]} />
      <meshStandardMaterial color="#27ae60" roughness={0.75} metalness={0.05} />
    </mesh>
  );
}

interface Model3DViewerProps {
  assetName: string;
}

export default function Model3DViewer({ assetName }: Model3DViewerProps) {
  const [autoRotate, setAutoRotate] = useState(true);

  // Map assetName to GLB URLs or procedural elements
  let content = null;
  let hasGLB = false;

  const nameLower = assetName.toLowerCase();

  if (nameLower.includes('batik') || nameLower.includes('kebat')) {
    content = <GLBModel url="/assets/kain_batik_kebat.glb" />;
    hasGLB = true;
  } else if (nameLower.includes('atap') || nameLower.includes('gazebo')) {
    content = <GLBModel url="/assets/gazebo_indonesia_style.glb" />;
    hasGLB = true;
  } else if (nameLower.includes('batu')) {
    content = <ProceduralBatu />;
  } else if (nameLower.includes('bunga') || nameLower.includes('rami')) {
    content = <ProceduralBunga />;
  } else if (nameLower.includes('teratai') || nameLower.includes('daun')) {
    content = <ProceduralTeratai />;
  } else {
    // Fallback if type not matched
    content = <ProceduralBatu />;
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden group shadow-inner">
      {/* Control Overlay */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md border cursor-pointer ${
            autoRotate
              ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <RotateCw size={12} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
          <span>Putar</span>
        </button>
      </div>

      <div className="absolute top-3 right-3 z-30 pointer-events-none bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 text-[9px] font-mono text-slate-400 px-2 py-0.5 rounded-full">
        {hasGLB ? 'Aset GLB' : 'Model Geometri'}
      </div>

      {/* R3F Canvas */}
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        <Suspense fallback={<ModelLoader />}>
          <Stage environment={null} intensity={0.6} shadows={false} adjustCamera={1.2}>
            <Center>
              {content}
            </Center>
          </Stage>
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      {/* Touch Interaction Hint */}
      <div className="absolute bottom-3 left-3 z-30 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-300 flex items-center gap-1 text-[9px] text-slate-400 font-sans">
        <Compass size={10} />
        <span>Geser / Scroll untuk melihat detail</span>
      </div>
    </div>
  );
}
