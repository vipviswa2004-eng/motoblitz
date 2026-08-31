import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/logo.png';

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState('revving'); // 'revving' | 'dash' | 'done'
  const [rpm, setRpm] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Animate RPM from 0 to 12000 over 1.4s
    const start = Date.now();
    const duration = 1400;
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setRpm(Math.round(eased * 12000));
      setProgress(Math.round(eased * 100));
      if (t >= 1) {
        clearInterval(intervalRef.current);
        setPhase('dash');
        setTimeout(() => setPhase('done'), 700);
        setTimeout(onComplete, 900);
      }
    }, 16);
    return () => clearInterval(intervalRef.current);
  }, [onComplete]);

  // Tachometer needle angle: -135deg = 0 RPM, +135deg = 12000 RPM
  const needleAngle = -135 + (rpm / 12000) * 270;
  const redlineStart = -135 + 0.8 * 270; // 80% mark

  // Build tachometer arc ticks
  const ticks = [];
  const cx = 80, cy = 80, r = 64;
  for (let i = 0; i <= 12; i++) {
    const angle = (-135 + (i / 12) * 270) * (Math.PI / 180);
    const isRedline = i >= 10;
    const isMajor = i % 2 === 0;
    const innerR = isMajor ? r - 12 : r - 7;
    ticks.push({
      x1: cx + innerR * Math.cos(angle),
      y1: cy + innerR * Math.sin(angle),
      x2: cx + r * Math.cos(angle),
      y2: cy + r * Math.sin(angle),
      isRedline,
      isMajor,
      label: isMajor ? i : null,
      lx: cx + (r - 20) * Math.cos(angle),
      ly: cy + (r - 20) * Math.sin(angle),
    });
  }

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0B0E] overflow-hidden"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(229,30,43,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(229,30,43,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />

          {/* Glowing orb behind gauge */}
          <div className="absolute w-80 h-80 rounded-full opacity-20" style={{
            background: 'radial-gradient(circle, #E51E2B 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />

          {/* Tachometer */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'backOut' }}
            className="relative"
          >
            <svg width="200" height="200" viewBox="0 0 160 160" className="drop-shadow-2xl">
              {/* Gauge background */}
              <circle cx="80" cy="80" r="75" fill="#12141C" stroke="#1F2330" strokeWidth="1.5" />

              {/* Sweep arc track */}
              <path
                d={describeArc(80, 80, 60, -135, 135)}
                fill="none"
                stroke="#1F2330"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Animated filled arc */}
              <motion.path
                d={describeArc(80, 80, 60, -135, -135 + (rpm / 12000) * 270)}
                fill="none"
                stroke={rpm > 9600 ? '#FF6E1A' : '#E51E2B'}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ stroke: rpm > 9600 ? '#FF6E1A' : '#E51E2B' }}
                transition={{ duration: 0.1 }}
              />

              {/* Ticks */}
              {ticks.map((tick, i) => (
                <g key={i}>
                  <line
                    x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2}
                    stroke={tick.isRedline ? '#FF6E1A' : '#94A3B8'}
                    strokeWidth={tick.isMajor ? 2 : 1}
                  />
                  {tick.label !== null && (
                    <text x={tick.lx} y={tick.ly}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="7" fontFamily="Rajdhani, sans-serif" fontWeight="600"
                      fill={tick.isRedline ? '#FF6E1A' : '#64748B'}
                    >
                      {tick.label}
                    </text>
                  )}
                </g>
              ))}

              {/* Needle */}
              <motion.line
                x1="80" y1="80"
                x2={80 + 52 * Math.cos((needleAngle) * Math.PI / 180)}
                y2={80 + 52 * Math.sin((needleAngle) * Math.PI / 180)}
                stroke="#E51E2B"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* Needle pivot */}
              <circle cx="80" cy="80" r="6" fill="#E51E2B" />
              <circle cx="80" cy="80" r="2.5" fill="#FF6E1A" />

              {/* Glow filter */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* RPM text */}
              <text x="80" y="108" textAnchor="middle" fontSize="18" fontFamily="Rajdhani, sans-serif"
                fontWeight="700" fill={rpm > 9600 ? '#FF6E1A' : 'white'}>
                {(rpm / 1000).toFixed(1)}
              </text>
              <text x="80" y="118" textAnchor="middle" fontSize="6" fontFamily="Rajdhani, sans-serif"
                fontWeight="500" fill="#64748B" letterSpacing="2">
                ×1000 RPM
              </text>
            </svg>
          </motion.div>

          {/* Bike Dash Animation */}
          <AnimatePresence>
            {phase === 'dash' && (
              <motion.div
                key="bike-dash"
                initial={{ x: '-150%', opacity: 0.8 }}
                animate={{ x: '150%', opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute"
                style={{ bottom: '28%' }}
              >
                <svg width="120" height="48" viewBox="0 0 120 48" fill="none">
                  {/* Flame trail */}
                  <ellipse cx="10" cy="30" rx="28" ry="5" fill="url(#flame)" opacity="0.7" />
                  {/* Simplified bike silhouette */}
                  <g fill="#E51E2B" opacity="0.9">
                    <ellipse cx="98" cy="34" rx="10" ry="10" fill="none" stroke="#E51E2B" strokeWidth="3" />
                    <ellipse cx="58" cy="34" rx="10" ry="10" fill="none" stroke="#E51E2B" strokeWidth="3" />
                    <polygon points="55,20 65,14 85,14 95,20 90,34 58,34" fill="#171A24" stroke="#E51E2B" strokeWidth="1.5" />
                    <rect x="64" y="12" width="18" height="6" rx="2" fill="#E51E2B" />
                    <line x1="70" y1="14" x2="62" y2="22" stroke="#FF6E1A" strokeWidth="1.5" />
                  </g>
                  <defs>
                    <linearGradient id="flame" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FF6E1A" stopOpacity="0" />
                      <stop offset="60%" stopColor="#FF6E1A" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#E51E2B" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logo & text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="MotoBlitz" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain border-2 border-brand-red/50 shadow-[0_0_25px_rgba(229,30,43,0.6)] animate-pulse" />
              <div className="text-left">
                <span className="font-racing text-3xl sm:text-4xl font-extrabold tracking-widest text-white block leading-none">
                  MOTO<span className="text-brand-red">BLITZ</span>
                </span>
                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest block mt-0.5">
                  High-Performance Parts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="h-px w-16 bg-dark-border" />
              <p className="text-xs text-slate-500 tracking-widest uppercase font-medium">
                {rpm < 12000 ? 'Starting Engine...' : 'Redline Hit — Let\'s Ride!'}
              </p>
              <div className="h-px w-16 bg-dark-border" />
            </div>

            {/* Progress bar */}
            <div className="w-40 h-1 bg-dark-surface rounded-full overflow-hidden mt-1">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #E51E2B, #FF6E1A)',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// SVG arc helper
function polarToCartesian(cx, cy, r, angleDeg) {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle + 90);
  const end = polarToCartesian(cx, cy, r, startAngle + 90);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}
