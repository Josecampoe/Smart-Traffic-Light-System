import { motion, AnimatePresence } from 'framer-motion'

const STATE_CONFIG = {
  RED:             { lights: [true,false,false],  color:'#ef4444', hex:'ef4444', glowClass:'glow-red',       flash:false, label:'ROJO'              },
  YELLOW:          { lights: [false,true,false],  color:'#eab308', hex:'eab308', glowClass:'glow-yellow',    flash:false, label:'AMARILLO'           },
  GREEN:           { lights: [false,false,true],  color:'#22c55e', hex:'22c55e', glowClass:'glow-green',     flash:false, label:'VERDE'              },
  FLASHING_YELLOW: { lights: [false,true,false],  color:'#f59e0b', hex:'f59e0b', glowClass:'glow-yellow',    flash:true,  label:'PARPADEO'           },
  EMERGENCY:       { lights: [true,false,false],  color:'#dc2626', hex:'dc2626', glowClass:'glow-emergency', flash:true,  label:'EMERGENCIA'         },
  OUT_OF_SERVICE:  { lights: [false,false,false], color:'#334155', hex:'334155', glowClass:'',               flash:false, label:'FUERA DE SERVICIO'  },
}

const BULB_OFF = ['#1a0505','#1a1200','#001a08']
const BULB_ON  = ['#ef4444','#eab308','#22c55e']

const SIZES = {
  sm: { W:44,  H:90,  r:12, cy:[22,45,68], bulbR:9,  poleH:0,  poleW:0  },
  md: { W:64,  H:130, r:16, cy:[30,65,100],bulbR:13, poleH:20, poleW:4  },
  lg: { W:90,  H:185, r:22, cy:[42,92,142],bulbR:19, poleH:30, poleW:6  },
}

export default function TrafficLightVisual({ state, size = 'md' }) {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.OUT_OF_SERVICE
  const s   = SIZES[size] || SIZES.md
  const totalH = s.H + s.poleH

  return (
    <div className="flex flex-col items-center select-none" style={{ gap: 6 }}>
      <svg width={s.W} height={totalH} viewBox={`0 0 ${s.W} ${totalH}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Housing gradient */}
          <linearGradient id={`hg-${size}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#1e3050"/>
            <stop offset="40%"  stopColor="#243a5e"/>
            <stop offset="100%" stopColor="#0f1e35"/>
          </linearGradient>
          {/* Housing inner shadow */}
          <linearGradient id={`hs-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.6)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)"/>
          </linearGradient>
          {/* Pole gradient */}
          <linearGradient id={`pg-${size}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#1e3050"/>
            <stop offset="50%"  stopColor="#2a4070"/>
            <stop offset="100%" stopColor="#0f1e35"/>
          </linearGradient>
          {/* Bulb on gradients */}
          {[0,1,2].map(i => (
            <radialGradient key={i} id={`bon-${size}-${i}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="white" stopOpacity="0.9"/>
              <stop offset="30%"  stopColor={BULB_ON[i]} stopOpacity="1"/>
              <stop offset="100%" stopColor={BULB_ON[i]} stopOpacity="0.6"/>
            </radialGradient>
          ))}
          {/* Bulb off gradients */}
          {[0,1,2].map(i => (
            <radialGradient key={i} id={`boff-${size}-${i}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%"   stopColor={BULB_OFF[i]} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={BULB_OFF[i]} stopOpacity="1"/>
            </radialGradient>
          ))}
          {/* Visor gradient */}
          <linearGradient id={`vg-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.8)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)"/>
          </linearGradient>
          {/* Drop shadow filter */}
          <filter id={`shadow-${size}`} x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.6)"/>
          </filter>
        </defs>

        {/* Pole */}
        {s.poleH > 0 && (
          <>
            <rect
              x={s.W/2 - s.poleW/2} y={s.H}
              width={s.poleW} height={s.poleH}
              fill={`url(#pg-${size})`} rx="2"
            />
            {/* Base plate */}
            <rect
              x={s.W/2 - s.poleW*2} y={s.H + s.poleH - 4}
              width={s.poleW*4} height={6}
              fill="#1e3050" rx="2"
            />
          </>
        )}

        {/* Housing shadow */}
        <rect x={4} y={4} width={s.W-8} height={s.H-4} rx={s.r} fill="rgba(0,0,0,0.4)" filter={`url(#shadow-${size})`}/>

        {/* Housing body */}
        <rect x={2} y={2} width={s.W-4} height={s.H-4} rx={s.r} fill={`url(#hg-${size})`}/>

        {/* Housing inner shading */}
        <rect x={2} y={2} width={s.W-4} height={s.H-4} rx={s.r} fill={`url(#hs-${size})`} opacity="0.5"/>

        {/* Housing border */}
        <rect x={2} y={2} width={s.W-4} height={s.H-4} rx={s.r}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

        {/* Side ribs */}
        {[0.25,0.5,0.75].map((t,i) => (
          <line key={i}
            x1={4} y1={s.H * t}
            x2={s.W-4} y2={s.H * t}
            stroke="rgba(0,0,0,0.3)" strokeWidth="1"
          />
        ))}

        {/* Mounting bolts */}
        {[[8,8],[s.W-8,8],[8,s.H-8],[s.W-8,s.H-8]].map(([bx,by],i) => (
          <g key={i}>
            <circle cx={bx} cy={by} r={s.r*0.18} fill="#0f1e35" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
            <line x1={bx-s.r*0.1} y1={by} x2={bx+s.r*0.1} y2={by} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1={bx} y1={by-s.r*0.1} x2={bx} y2={by+s.r*0.1} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
          </g>
        ))}

        {/* Bulbs */}
        {[0,1,2].map(i => {
          const isOn = cfg.lights[i]
          const isFlash = isOn && cfg.flash
          const cx = s.W / 2
          const cy = s.cy[i]
          const r  = s.bulbR

          return (
            <g key={i}>
              {/* Visor hood */}
              <path
                d={`M ${cx-r*1.3} ${cy-r*0.3} Q ${cx} ${cy-r*1.8} ${cx+r*1.3} ${cy-r*0.3}`}
                fill={`url(#vg-${size})`} opacity="0.7"
              />

              {/* Socket ring */}
              <circle cx={cx} cy={cy} r={r+3}
                fill="#0a1628" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

              {/* Bulb glow halo (only when on) */}
              {isOn && !isFlash && (
                <circle cx={cx} cy={cy} r={r+8}
                  fill={`#${cfg.hex}`} opacity="0.08"/>
              )}

              {/* Bulb */}
              <circle
                cx={cx} cy={cy} r={r}
                fill={isOn ? `url(#bon-${size}-${i})` : `url(#boff-${size}-${i})`}
                className={isFlash ? 'flash-bulb' : isOn ? cfg.glowClass : ''}
              />

              {/* Specular highlight */}
              {isOn && (
                <ellipse
                  cx={cx - r*0.25} cy={cy - r*0.3}
                  rx={r*0.35} ry={r*0.22}
                  fill="white" opacity="0.55"
                  className={isFlash ? 'flash-bulb' : ''}
                />
              )}

              {/* Lens ring */}
              <circle cx={cx} cy={cy} r={r}
                fill="none"
                stroke={isOn ? `rgba(255,255,255,0.2)` : 'rgba(255,255,255,0.04)'}
                strokeWidth="1"
              />
            </g>
          )
        })}

        {/* Top shine */}
        <rect x={6} y={4} width={s.W-12} height={s.H*0.08} rx={s.r*0.5}
          fill="rgba(255,255,255,0.04)"/>
      </svg>

      {/* State label */}
      {size !== 'sm' && (
        <motion.div
          key={state}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: `rgba(${hexToRgb(cfg.hex)},0.12)`,
            border: `1px solid rgba(${hexToRgb(cfg.hex)},0.3)`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        </motion.div>
      )}
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(0,2),16)
  const g = parseInt(hex.slice(2,4),16)
  const b = parseInt(hex.slice(4,6),16)
  return `${r},${g},${b}`
}
