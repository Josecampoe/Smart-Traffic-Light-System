import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import TrafficLightVisual from './TrafficLightVisual'
import ControlPanel from './ControlPanel'
import { intersectionApi } from '../services/api'

const STATE_META = {
  RED:             { label:'Rojo',              color:'#ef4444', rgb:'239,68,68',    icon:'🔴' },
  GREEN:           { label:'Verde',             color:'#22c55e', rgb:'34,197,94',    icon:'🟢' },
  YELLOW:          { label:'Amarillo',          color:'#eab308', rgb:'234,179,8',    icon:'🟡' },
  FLASHING_YELLOW: { label:'Amarillo Parpadeo', color:'#f59e0b', rgb:'245,158,11',   icon:'🟠' },
  EMERGENCY:       { label:'Emergencia',        color:'#dc2626', rgb:'220,38,38',    icon:'🚨' },
  OUT_OF_SERVICE:  { label:'Fuera de Servicio', color:'#64748b', rgb:'100,116,139',  icon:'⚫' },
}

function Countdown({ durationInSeconds, state }) {
  const [remaining, setRemaining] = useState(durationInSeconds)

  useEffect(() => {
    setRemaining(durationInSeconds)
    if (durationInSeconds <= 0) return
    const t = setInterval(() => setRemaining(r => r <= 1 ? durationInSeconds : r - 1), 1000)
    return () => clearInterval(t)
  }, [durationInSeconds, state])

  if (durationInSeconds === -1) {
    return <span className="text-xs font-mono" style={{ color: 'var(--text-3)' }}>∞</span>
  }

  const pct = ((durationInSeconds - remaining) / durationInSeconds) * 100
  const meta = STATE_META[state] || STATE_META.OUT_OF_SERVICE

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90">
          <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
          <motion.circle
            cx="16" cy="16" r="12"
            fill="none"
            stroke={meta.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 12}`}
            strokeDashoffset={`${2 * Math.PI * 12 * (1 - pct/100)}`}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono"
          style={{ color: meta.color, fontSize: 9 }}>
          {remaining}
        </span>
      </div>
    </div>
  )
}

export default function IntersectionGrid({ intersections, onRefresh }) {
  const [loadingEmergency, setLoadingEmergency] = useState(null)
  const [localLights, setLocalLights] = useState({})

  function getLight(light) { return localLights[light.id] || light }
  function handleLightUpdate(updated) {
    setLocalLights(prev => ({ ...prev, [updated.id]: updated }))
  }

  async function handleIntersectionEmergency(id, name) {
    setLoadingEmergency(id)
    try {
      await intersectionApi.emergency(id)
      toast.success(`Emergencia activada en ${name}`)
      onRefresh()
    } catch {
      toast.error('Error al activar emergencia')
    } finally {
      setLoadingEmergency(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {intersections.map((intersection, i) => {
        const hasEmergency = (intersection.trafficLights || []).some(l =>
          (localLights[l.id] || l).currentState === 'EMERGENCY'
        )

        return (
          <motion.div
            key={intersection.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #0f1a2e 0%, #0a1220 100%)',
              border: hasEmergency ? '1px solid rgba(220,38,38,0.4)' : '1px solid var(--border)',
              boxShadow: hasEmergency
                ? '0 0 30px rgba(220,38,38,0.12), 0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {/* Card header */}
            <div className="px-4 pt-4 pb-3 flex items-start justify-between"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="min-w-0 flex-1">
                <Link to={`/interseccion/${intersection.id}`}
                  className="group flex items-center gap-1.5 text-sm font-bold text-white hover:text-blue-400 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-slate-600 group-hover:text-blue-400 transition-colors">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                  </svg>
                  <span className="truncate">{intersection.name}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </Link>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-3)' }}>{intersection.location}</p>
                {intersection.district && (
                  <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                    {intersection.district}
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleIntersectionEmergency(intersection.id, intersection.name)}
                disabled={loadingEmergency === intersection.id}
                className="shrink-0 ml-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(153,27,27,0.4), rgba(220,38,38,0.25))',
                  border: '1px solid rgba(220,38,38,0.3)',
                  color: '#fca5a5',
                  boxShadow: '0 2px 8px rgba(220,38,38,0.15)',
                }}
              >
                {loadingEmergency === intersection.id
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                }
                <span className="hidden sm:inline">Emergencia</span>
              </motion.button>
            </div>

            {/* Traffic lights */}
            <div className="p-3 space-y-2 flex-1">
              <AnimatePresence>
                {(intersection.trafficLights || []).map(light => {
                  const current = getLight(light)
                  const meta = STATE_META[current.currentState] || STATE_META.OUT_OF_SERVICE
                  const isEmergency = current.currentState === 'EMERGENCY'
                  const isOOS = current.currentState === 'OUT_OF_SERVICE'

                  return (
                    <motion.div
                      key={light.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-xl p-3 flex gap-3 items-center"
                      style={{
                        background: `rgba(${meta.rgb},0.07)`,
                        border: `1px solid rgba(${meta.rgb},0.18)`,
                        boxShadow: isEmergency ? `0 0 20px rgba(${meta.rgb},0.12)` : 'none',
                      }}
                    >
                      {/* Traffic light visual */}
                      <div className="shrink-0">
                        <TrafficLightVisual state={current.currentState} size="sm" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-white truncate">{current.name}</p>
                          {current.durationInSeconds > 0 && (
                            <Countdown
                              durationInSeconds={current.durationInSeconds}
                              state={current.currentState}
                            />
                          )}
                        </div>

                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-3)' }}>
                          {current.streetAddress}
                        </p>

                        {/* Status row */}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md font-semibold"
                            style={{ background: `rgba(${meta.rgb},0.15)`, color: meta.color, border: `1px solid rgba(${meta.rgb},0.25)` }}>
                            {meta.icon} {meta.label}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md font-medium ${
                            current.vehicleAllowedToProceed
                              ? 'text-green-400' : 'text-red-400'
                          }`} style={{
                            background: current.vehicleAllowedToProceed ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                            border: current.vehicleAllowedToProceed ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)',
                          }}>
                            🚗 {current.vehicleAllowedToProceed ? 'Avanzar' : 'Alto'}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md font-medium ${
                            current.pedestrianAllowedToCross
                              ? 'text-green-400' : 'text-red-400'
                          }`} style={{
                            background: current.pedestrianAllowedToCross ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                            border: current.pedestrianAllowedToCross ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)',
                          }}>
                            🚶 {current.pedestrianAllowedToCross ? 'Cruzar' : 'Esperar'}
                          </span>
                        </div>

                        <ControlPanel light={current} onUpdate={handleLightUpdate} compact />
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
