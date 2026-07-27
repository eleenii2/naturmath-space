import { useEffect, useState } from 'react';

interface AnimatedGeometryProps {
  shape: 'persegi' | 'segitiga' | 'lingkaran';
  activePropertyIndex: number; // -1 = only outline, 0+ = which property is highlighted
  drawComplete: boolean;
}

// Mapping of which geometry elements to highlight per property index
// persegi: 0=4 sisi, 1=sama panjang, 2=4 titik sudut, 3=sudut siku-siku, 4=sisi sejajar
// segitiga: 0=3 sisi, 1=3 titik sudut, 2=sisi bertemu tertutup
// lingkaran: 0=1 sisi melengkung, 1=tak ada sisi lurus, 2=tak ada titik sudut, 3=titik pusat

export default function AnimatedGeometry({ shape, activePropertyIndex, drawComplete }: AnimatedGeometryProps) {
  const [dashOffset, setDashOffset] = useState(800);

  useEffect(() => {
    if (drawComplete) {
      // Animate from full offset to 0
      const timer = setTimeout(() => setDashOffset(0), 100);
      return () => clearTimeout(timer);
    } else {
      setDashOffset(800);
    }
  }, [drawComplete]);

  const perimeter = shape === 'persegi' ? 560 : shape === 'segitiga' ? 484 : 440;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 280 280"
        className="w-full h-full max-w-[260px] max-h-[260px]"
        style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))' }}
      >
        {/* Background glow circle */}
        <circle cx="140" cy="140" r="120" fill="rgba(16, 185, 129, 0.04)" stroke="none" />

        {shape === 'persegi' && <PersegiSVG dashOffset={dashOffset} perimeter={perimeter} activeIndex={activePropertyIndex} />}
        {shape === 'segitiga' && <SegitigaSVG dashOffset={dashOffset} perimeter={perimeter} activeIndex={activePropertyIndex} />}
        {shape === 'lingkaran' && <LingkaranSVG dashOffset={dashOffset} perimeter={perimeter} activeIndex={activePropertyIndex} />}
      </svg>
    </div>
  );
}

/* ============================================
   PERSEGI SVG
   ============================================ */
function PersegiSVG({ dashOffset, perimeter, activeIndex }: { dashOffset: number; perimeter: number; activeIndex: number }) {
  const x = 50, y = 50, size = 180;
  const vertices = [
    { x: x, y: y, label: 'A' },
    { x: x + size, y: y, label: 'B' },
    { x: x + size, y: y + size, label: 'C' },
    { x: x, y: y + size, label: 'D' },
  ];

  const sides = [
    { x1: vertices[0].x, y1: vertices[0].y, x2: vertices[1].x, y2: vertices[1].y }, // AB (top)
    { x1: vertices[1].x, y1: vertices[1].y, x2: vertices[2].x, y2: vertices[2].y }, // BC (right)
    { x1: vertices[2].x, y1: vertices[2].y, x2: vertices[3].x, y2: vertices[3].y }, // CD (bottom)
    { x1: vertices[3].x, y1: vertices[3].y, x2: vertices[0].x, y2: vertices[0].y }, // DA (left)
  ];

  // activeIndex: 0=4sisi, 1=sama panjang, 2=4titik sudut, 3=siku-siku, 4=sejajar
  const highlightAllSides = activeIndex === 0 || activeIndex === 1;
  const highlightVertices = activeIndex === 2;
  const highlightAngles = activeIndex === 3;
  const highlightParallel = activeIndex === 4;

  return (
    <g>
      {/* Main outline with draw animation */}
      <rect
        x={x} y={y} width={size} height={size}
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeDasharray={perimeter}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'stroke-dashoffset 2s ease-out' }}
      />

      {/* Highlighted sides */}
      {highlightAllSides && sides.map((s, i) => (
        <line key={`side-${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          className="animate-highlight-blink"
          style={{ animationDelay: `${i * 0.15}s` }}
          fill="none"
        />
      ))}

      {/* Equal length markers */}
      {activeIndex === 1 && sides.map((s, i) => {
        const mx = (s.x1 + s.x2) / 2;
        const my = (s.y1 + s.y2) / 2;
        return (
          <g key={`eq-${i}`} className="animate-glow-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
            <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill="#fbbf24"
              dx={i === 0 || i === 2 ? 0 : (i === 1 ? 14 : -14)}
              dy={i === 0 ? -12 : (i === 2 ? 14 : 0)}
            >
              =
            </text>
          </g>
        );
      })}

      {/* Vertices with labels */}
      {dashOffset === 0 && vertices.map((v, i) => (
        <g key={`v-${i}`}>
          <circle cx={v.x} cy={v.y} r={highlightVertices ? 7 : 5}
            fill={highlightVertices ? '#fbbf24' : '#059669'}
            className={highlightVertices ? 'animate-vertex-pulse' : ''}
            style={highlightVertices ? { animationDelay: `${i * 0.2}s` } : {}}
          />
          <text x={v.x + (v.x < 140 ? -14 : 14)} y={v.y + (v.y < 140 ? -8 : 16)}
            fontSize="13" fontWeight="bold" fill={highlightVertices ? '#fbbf24' : '#6ee7b7'}
            textAnchor="middle"
            className={highlightVertices ? 'animate-glow-pulse' : ''}
          >
            {v.label}
          </text>
        </g>
      ))}

      {/* Right angle markers */}
      {highlightAngles && vertices.map((v, i) => {
        const sq = 18;
        const dx = i === 0 || i === 3 ? sq : -sq;
        const dy = i === 0 || i === 1 ? sq : -sq;
        return (
          <g key={`angle-${i}`} className="animate-glow-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
            <path
              d={`M ${v.x + dx},${v.y} L ${v.x + dx},${v.y + dy} L ${v.x},${v.y + dy}`}
              fill="none" stroke="#fbbf24" strokeWidth="2"
            />
            <text x={v.x + dx * 0.7} y={v.y + dy * 0.7} textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fontWeight="bold" fill="#fbbf24"
            >
              90°
            </text>
          </g>
        );
      })}

      {/* Parallel arrows */}
      {highlightParallel && (
        <g>
          {/* Top-Bottom parallel */}
          <g className="animate-highlight-blink">
            <line x1={sides[0].x1} y1={sides[0].y1} x2={sides[0].x2} y2={sides[0].y2} fill="none" />
            <line x1={sides[2].x1} y1={sides[2].y1} x2={sides[2].x2} y2={sides[2].y2} fill="none" />
          </g>
          {/* Parallel marker arrows */}
          <text x={140} y={y - 8} textAnchor="middle" fontSize="14" fill="#fbbf24" className="animate-glow-pulse">↔</text>
          <text x={140} y={y + size + 16} textAnchor="middle" fontSize="14" fill="#fbbf24" className="animate-glow-pulse">↔</text>
          {/* Left-Right parallel */}
          <g className="animate-highlight-blink" style={{ animationDelay: '0.5s' }}>
            <line x1={sides[1].x1} y1={sides[1].y1} x2={sides[1].x2} y2={sides[1].y2} fill="none" />
            <line x1={sides[3].x1} y1={sides[3].y1} x2={sides[3].x2} y2={sides[3].y2} fill="none" />
          </g>
          <text x={x - 12} y={140} textAnchor="middle" fontSize="14" fill="#fbbf24" className="animate-glow-pulse" style={{ animationDelay: '0.5s' }}>↕</text>
          <text x={x + size + 14} y={140} textAnchor="middle" fontSize="14" fill="#fbbf24" className="animate-glow-pulse" style={{ animationDelay: '0.5s' }}>↕</text>
        </g>
      )}
    </g>
  );
}

/* ============================================
   SEGITIGA SVG
   ============================================ */
function SegitigaSVG({ dashOffset, perimeter, activeIndex }: { dashOffset: number; perimeter: number; activeIndex: number }) {
  const vertices = [
    { x: 140, y: 40, label: 'C' },   // top
    { x: 40, y: 230, label: 'A' },    // bottom-left
    { x: 240, y: 230, label: 'B' },   // bottom-right
  ];

  const sides = [
    { x1: vertices[0].x, y1: vertices[0].y, x2: vertices[1].x, y2: vertices[1].y }, // CA
    { x1: vertices[1].x, y1: vertices[1].y, x2: vertices[2].x, y2: vertices[2].y }, // AB
    { x1: vertices[2].x, y1: vertices[2].y, x2: vertices[0].x, y2: vertices[0].y }, // BC
  ];

  // activeIndex: 0=3sisi, 1=3titik sudut, 2=tertutup
  const highlightAllSides = activeIndex === 0;
  const highlightVertices = activeIndex === 1;
  const highlightClosed = activeIndex === 2;

  const pointsStr = vertices.map(v => `${v.x},${v.y}`).join(' ');

  return (
    <g>
      {/* Main outline with draw animation */}
      <polygon
        points={pointsStr}
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeDasharray={perimeter}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'stroke-dashoffset 2s ease-out' }}
      />

      {/* Highlighted sides */}
      {highlightAllSides && sides.map((s, i) => (
        <line key={`side-${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          className="animate-highlight-blink"
          style={{ animationDelay: `${i * 0.25}s` }}
          fill="none"
        />
      ))}

      {/* Side labels */}
      {highlightAllSides && sides.map((s, i) => {
        const mx = (s.x1 + s.x2) / 2;
        const my = (s.y1 + s.y2) / 2;
        const labels = ['sisi 1', 'sisi 2', 'sisi 3'];
        const offX = i === 0 ? -20 : i === 2 ? 20 : 0;
        const offY = i === 1 ? 18 : -6;
        return (
          <text key={`sl-${i}`} x={mx + offX} y={my + offY} textAnchor="middle" fontSize="10" fontWeight="bold"
            fill="#fbbf24" className="animate-glow-pulse" style={{ animationDelay: `${i * 0.25}s` }}
          >
            {labels[i]}
          </text>
        );
      })}

      {/* Vertices with labels */}
      {dashOffset === 0 && vertices.map((v, i) => (
        <g key={`v-${i}`}>
          <circle cx={v.x} cy={v.y} r={highlightVertices ? 7 : 5}
            fill={highlightVertices ? '#fbbf24' : '#059669'}
            className={highlightVertices ? 'animate-vertex-pulse' : ''}
            style={highlightVertices ? { animationDelay: `${i * 0.25}s` } : {}}
          />
          <text x={v.x + (i === 0 ? 0 : i === 1 ? -14 : 14)} y={v.y + (i === 0 ? -12 : 18)}
            fontSize="13" fontWeight="bold" fill={highlightVertices ? '#fbbf24' : '#6ee7b7'}
            textAnchor="middle"
            className={highlightVertices ? 'animate-glow-pulse' : ''}
          >
            {v.label}
          </text>
        </g>
      ))}

      {/* Closed shape highlight — fill glow */}
      {highlightClosed && (
        <polygon
          points={pointsStr}
          fill="rgba(251, 191, 36, 0.12)"
          stroke="#fbbf24"
          strokeWidth="4"
          className="animate-glow-pulse"
        />
      )}

      {/* Angle arcs for closed visualization */}
      {highlightClosed && vertices.map((_, i) => {
        const curr = vertices[i];
        const prev = vertices[(i + 2) % 3];
        const next = vertices[(i + 1) % 3];
        // Simple angle arc
        const r = 24;
        const ang1 = Math.atan2(prev.y - curr.y, prev.x - curr.x);
        const ang2 = Math.atan2(next.y - curr.y, next.x - curr.x);
        const ax1 = curr.x + r * Math.cos(ang1);
        const ay1 = curr.y + r * Math.sin(ang1);
        const ax2 = curr.x + r * Math.cos(ang2);
        const ay2 = curr.y + r * Math.sin(ang2);
        return (
          <path key={`arc-${i}`}
            d={`M ${ax1},${ay1} A ${r},${r} 0 0,1 ${ax2},${ay2}`}
            fill="none" stroke="#fbbf24" strokeWidth="2"
            className="animate-glow-pulse" style={{ animationDelay: `${i * 0.2}s` }}
          />
        );
      })}
    </g>
  );
}

/* ============================================
   LINGKARAN SVG
   ============================================ */
function LingkaranSVG({ dashOffset, perimeter, activeIndex }: { dashOffset: number; perimeter: number; activeIndex: number }) {
  const cx = 140, cy = 140, r = 90;

  // activeIndex: 0=1sisi melengkung, 1=tak ada sisi lurus, 2=tak ada titik sudut, 3=titik pusat
  const highlightCurvedSide = activeIndex === 0;
  const highlightNoStraight = activeIndex === 1;
  const highlightNoVertex = activeIndex === 2;
  const highlightCenter = activeIndex === 3;

  return (
    <g>
      {/* Main outline with draw animation */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeDasharray={perimeter}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 2s ease-out' }}
      />

      {/* Curved side highlight — thick glowing ring */}
      {highlightCurvedSide && (
        <circle cx={cx} cy={cy} r={r}
          fill="none" stroke="#fbbf24" strokeWidth="5"
          className="animate-highlight-blink"
        />
      )}

      {/* Arrow indicator on curve */}
      {highlightCurvedSide && (
        <g className="animate-glow-pulse">
          <text x={cx + r + 6} y={cy - 4} fontSize="18" fill="#fbbf24" fontWeight="bold">→</text>
          <text x={cx} y={cy - r - 8} fontSize="10" fill="#fbbf24" fontWeight="bold" textAnchor="middle">1 sisi melengkung</text>
        </g>
      )}

      {/* No straight sides — crossed line */}
      {highlightNoStraight && (
        <g className="animate-glow-pulse">
          <line x1={cx - 40} y1={cy} x2={cx + 40} y2={cy} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6,4" />
          <line x1={cx - 30} y1={cy - 10} x2={cx + 30} y2={cy + 10} stroke="#ef4444" strokeWidth="3" />
          <text x={cx} y={cy + 30} fontSize="10" fill="#fbbf24" fontWeight="bold" textAnchor="middle">
            🚫 Tidak ada sisi lurus
          </text>
        </g>
      )}

      {/* No vertices — empty dots with X */}
      {highlightNoVertex && (
        <g className="animate-glow-pulse">
          {[0, 90, 180, 270].map((deg, i) => {
            const px = cx + r * Math.cos((deg * Math.PI) / 180);
            const py = cy + r * Math.sin((deg * Math.PI) / 180);
            return (
              <g key={`nv-${i}`}>
                <circle cx={px} cy={py} r="5" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" />
                <text x={px} y={py + 4} textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">✕</text>
              </g>
            );
          })}
          <text x={cx} y={cy + r + 22} fontSize="10" fill="#fbbf24" fontWeight="bold" textAnchor="middle">
            🚫 Tidak ada titik sudut
          </text>
        </g>
      )}

      {/* Center point + radius */}
      {dashOffset === 0 && (
        <circle cx={cx} cy={cy} r={highlightCenter ? 6 : 4}
          fill={highlightCenter ? '#fbbf24' : '#059669'}
          className={highlightCenter ? 'animate-vertex-pulse' : ''}
        />
      )}

      {highlightCenter && (
        <g className="animate-glow-pulse">
          <text x={cx - 4} y={cy - 12} fontSize="12" fontWeight="bold" fill="#fbbf24">O</text>
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,3" />
          <text x={cx + r / 2} y={cy - 8} fontSize="10" fill="#fbbf24" fontWeight="bold" textAnchor="middle">r</text>

          {/* Concentric glow ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.4" strokeDasharray="4,4" />
          
          {/* Distance markers */}
          {[45, 135, 225, 315].map((deg, i) => {
            const px = cx + r * Math.cos((deg * Math.PI) / 180);
            const py = cy + r * Math.sin((deg * Math.PI) / 180);
            return (
              <line key={`dist-${i}`} x1={cx} y1={cy} x2={px} y2={py}
                stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,5" opacity="0.35"
              />
            );
          })}
        </g>
      )}
    </g>
  );
}
