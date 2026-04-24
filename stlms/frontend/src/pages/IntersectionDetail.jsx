import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { intersectionApi, historyApi } from '../services/api'
import TrafficLightVisual from '../components/TrafficLightVisual'
import ControlPanel from '../components/ControlPanel'
import StateHistoryTimeline from '../components/StateHistoryTimeline'

const STATE_META = {
  RED:             { label:'Rojo',              color:'#ef4444', rgb:'239,68,68'   },
  GREEN:           { label:'Verde',             color:'#22c55e', rgb:'34,197,94'   },
  YELLOW:          { label:'Amarillo',          color:'#eab308', rgb:'234,179,8'   },
  FLASHING_YELLOW: { label:'Amarillo Parpadeo', color:'#f59e0b', rgb:'245,158,11'  },
  EMERGENCY:       { label:'Emergencia',        color:'#dc2626', rgb:'220,38,38'   },
  OUT_OF_SERVICE:  { label:'Fuera de Servicio', color:'#64748b', rgb:'100,116,139' },
}

export default function IntersectionDetail() {
  const { id } = useParams()
  const [intersection, setIntersection] = useState(null)
  const [histories, setHistories] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState({})

  useEffect(() => {
    async function load() {
      try {
        const res = await intersectionApi.getById(id)
        setIntersection(res.data)
        const results = await Promise.all(res.data.trafficLights.map(l => historyApi.getByLight(l.id)))
        const map = {}
        res.data.trafficLights.forEach((l, i) => { map[l.id] = results[i].data })
        setHistories(map)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  function handleLightUpdate(updated) {
    setIntersection(prev => ({
      ...prev,
      trafficLights: prev.trafficLights.map(l => l.id === updated.id ? updated : l)
    }))
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-5 w-40 skeleton" />
        <div className="h-28 skeleton" />
        {[0,1].map(i => <div key={i} className="h-80 skeleton" />)}
      </div>
    )
  }

  if (!intersection) {
    return (
      <div className="text-center py-20">
        <p style={{ color: 'var(--text-3)' }}>Intersección no encontrada</p>
        <Link to="/" className="text-blue-400 text-sm mt-2 inline-block hover:underline">← Volver al panel</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/" className="transition-colors hover:text-white" style={{ color: 'var(--text-3)' }}>
          Panel Principal
        </Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-3)' }}>
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <span className="text-white font-medium">{intersection.name}</span>
      </nav>

      {/* Intersection header */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1a2e, #0a1220)', border: '1px solid var(--border-md)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="flex items-start gap-4 relative">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.25)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{intersection.name}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>{intersection.location}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {intersection.district && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                  📍 {intersection.district}
                </span>
              )}
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.18)' }}>
                🚦 {intersection.trafficLights?.length} semáforos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic lights */}
      <div className="space-y-5">
        {intersection.trafficLights.map((light, i) => {
          const meta = STATE_META[light.currentState] || STATE_META.OUT_OF_SERVICE
          const tab = activeTab[light.id] || 'control'

          return (
            <motion.div
              key={light.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid rgba(${meta.rgb},0.25)`,
                boxShadow: `0 8px 32px rgba(${meta.rgb},0.06)`,
              }}
            >
              {/* Light hero section */}
              <div className="p-6 flex gap-6 items-start"
                style={{ borderBottom: '1px solid var(--border)', background: `linear-gradient(135deg, rgba(${meta.rgb},0.06) 0%, transparent 60%)` }}>

                {/* Traffic light visual — large */}
                <div className="shrink-0 float-anim">
                  <TrafficLightVisual state={light.currentState} size="lg" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="text-xl font-bold text-white">{light.name}</h2>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>{light.streetAddress}</p>
                    </div>
                    <span className="text-xs px-3 py-1.5 rounded-full font-bold shrink-0"
                      style={{ background: `rgba(${meta.rgb},0.15)`, color: meta.color, border: `1px solid rgba(${meta.rgb},0.3)` }}>
                      {meta.label}
                    </span>
                  </div>

                  {/* Properties */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                    <PropCard label="Vehículos" value={light.vehicleAllowedToProceed ? 'Permitido' : 'Detenido'} ok={light.vehicleAllowedToProceed}
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
                    />
                    <PropCard label="Peatones" value={light.pedestrianAllowedToCross ? 'Permitido' : 'Esperar'} ok={light.pedestrianAllowedToCross}
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v6l-3 3m3-3l3 3"/><path d="M9 13l-2 4m8-4l2 4"/></svg>}
                    />
                    <PropCard label="Duración" value={light.durationInSeconds === -1 ? 'Indefinida' : `${light.durationInSeconds}s`} neutral
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                    />
                    <PropCard label="Transiciones" value={light.allowedTransitions?.length || 0} neutral
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>}
                    />
                  </div>

                  {/* Allowed transitions */}
                  <div className="mt-3">
                    <p className="text-xs mb-1.5" style={{ color: 'var(--text-3)' }}>Transiciones permitidas:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(light.allowedTransitions || []).map(t => {
                        const m = STATE_META[t] || { color: '#64748b', rgb: '100,116,139', label: t }
                        return (
                          <span key={t} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `rgba(${m.rgb},0.1)`, color: m.color, border: `1px solid rgba(${m.rgb},0.2)` }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                            </svg>
                            {m.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
                {[
                  { id: 'control', label: 'Control', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg> },
                  { id: 'info',    label: 'Información', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
                  { id: 'history', label: 'Historial', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                ].map(t => (
                  <button key={t.id}
                    onClick={() => setActiveTab(prev => ({ ...prev, [light.id]: t.id }))}
                    className="flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-all relative"
                    style={tab === t.id
                      ? { color: '#38bdf8', borderBottom: '2px solid #38bdf8' }
                      : { color: 'var(--text-3)', borderBottom: '2px solid transparent' }
                    }
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-5"
                >
                  {tab === 'control' && (
                    <div>
                      <p className="text-xs mb-3" style={{ color: 'var(--text-3)' }}>
                        Acciones disponibles para el estado actual ({meta.label}):
                      </p>
                      <ControlPanel light={light} onUpdate={handleLightUpdate} />
                    </div>
                  )}
                  {tab === 'info' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {[
                        { label: 'ID del semáforo', value: `#${light.id}`, mono: true },
                        { label: 'Estado actual', value: meta.label, color: meta.color },
                        { label: 'Estado anterior', value: light.previousState ? (STATE_META[light.previousState]?.label || light.previousState) : '—', color: light.previousState ? STATE_META[light.previousState]?.color : undefined },
                        { label: 'Intersección', value: intersection.name },
                        { label: 'Dirección', value: light.streetAddress },
                        { label: 'Distrito', value: intersection.district || '—' },
                      ].map(row => (
                        <div key={row.label} className="px-3 py-2.5 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                          <p className="text-xs" style={{ color: 'var(--text-3)' }}>{row.label}</p>
                          <p className={`text-sm font-semibold mt-0.5 ${row.mono ? 'font-mono' : ''}`}
                            style={{ color: row.color || 'var(--text-1)' }}>
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === 'history' && (
                    <StateHistoryTimeline transitions={histories[light.id] || []} />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function PropCard({ label, value, ok, neutral, icon }) {
  const color  = neutral ? '#64748b' : ok ? '#4ade80' : '#f87171'
  const bg     = neutral ? 'rgba(100,116,139,0.08)' : ok ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'
  const border = neutral ? 'rgba(100,116,139,0.15)' : ok ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)'
  return (
    <div className="rounded-xl p-3" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="flex items-center gap-1.5 mb-1" style={{ color }}>
        {icon}
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>{label}</p>
      </div>
      <p className="text-sm font-bold" style={{ color }}>{value}</p>
    </div>
  )
}
