import { motion } from 'framer-motion'

const STATE_META = {
  RED:             { label:'Rojo',              color:'#ef4444', rgb:'239,68,68'   },
  GREEN:           { label:'Verde',             color:'#22c55e', rgb:'34,197,94'   },
  YELLOW:          { label:'Amarillo',          color:'#eab308', rgb:'234,179,8'   },
  FLASHING_YELLOW: { label:'Amar. Parpadeo',    color:'#f59e0b', rgb:'245,158,11'  },
  EMERGENCY:       { label:'Emergencia',        color:'#dc2626', rgb:'220,38,38'   },
  OUT_OF_SERVICE:  { label:'Fuera de Servicio', color:'#64748b', rgb:'100,116,139' },
}

const TRIGGER_META = {
  SYSTEM:           { label:'Sistema',    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg> },
  OPERATOR:         { label:'Operador',   icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  EMERGENCY_SYSTEM: { label:'Emergencia', icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg> },
}

function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleString('es-MX', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' })
}

function StateBadge({ state }) {
  const m = STATE_META[state] || { label: state, color: '#64748b', rgb: '100,116,139' }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: `rgba(${m.rgb},0.12)`, color: m.color, border: `1px solid rgba(${m.rgb},0.25)` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

export default function StateHistoryTimeline({ transitions }) {
  if (!transitions?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a3a5a" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-3)' }}>Sin historial disponible</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['Semáforo', 'Transición', 'Fecha / Hora', 'Razón', 'Operador'].map(h => (
              <th key={h} className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                style={{ color: 'var(--text-3)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transitions.map((t, i) => {
            const trigger = TRIGGER_META[t.triggeredBy] || TRIGGER_META.OPERATOR
            return (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.025, 0.5) }}
                className="group"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
              >
                <td className="py-2.5 pr-4">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-1)' }}>
                    {t.trafficLightName}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <StateBadge state={t.fromState} />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a3a5a" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                    <StateBadge state={t.toState} />
                  </div>
                </td>
                <td className="py-2.5 pr-4 whitespace-nowrap">
                  <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>
                    {formatDate(t.transitionTime)}
                  </span>
                </td>
                <td className="py-2.5 pr-4 max-w-[180px]">
                  <span className="text-xs truncate block" style={{ color: 'var(--text-3)' }} title={t.reason}>
                    {t.reason || '—'}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-3)' }}>{trigger.icon}</span>
                    {trigger.label}
                  </span>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
