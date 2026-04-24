import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { intersectionApi, historyApi } from '../services/api'
import IntersectionGrid from '../components/IntersectionGrid'
import EmergencyAlert from '../components/EmergencyAlert'

const STATE_META = {
  RED:             { label:'Rojo',              color:'#ef4444' },
  GREEN:           { label:'Verde',             color:'#22c55e' },
  YELLOW:          { label:'Amarillo',          color:'#eab308' },
  FLASHING_YELLOW: { label:'Amarillo Parpadeo', color:'#f59e0b' },
  EMERGENCY:       { label:'Emergencia',        color:'#dc2626' },
  OUT_OF_SERVICE:  { label:'Fuera de Servicio', color:'#64748b' },
}

export default function Dashboard() {
  const [intersections, setIntersections] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [tick, setTick] = useState(0)

  const fetchData = useCallback(async () => {
    try {
      const [intRes, statsRes] = await Promise.all([
        intersectionApi.getAll(),
        historyApi.getStats(),
      ])
      setIntersections(intRes.data)
      setStats(statsRes.data)
      setLastUpdate(new Date())
      setError(null)
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const dataInterval = setInterval(fetchData, 15000)
    const tickInterval = setInterval(() => setTick(t => t + 1), 1000)
    return () => { clearInterval(dataInterval); clearInterval(tickInterval) }
  }, [fetchData])

  const allLights = intersections.flatMap(i => i.trafficLights || [])
  const totalLights = allLights.length
  const emergencyCount = allLights.filter(l => l.currentState === 'EMERGENCY').length
  const activeCount = allLights.filter(l => l.currentState !== 'OUT_OF_SERVICE').length
  const totalTransitions = Object.values(stats).reduce((a, b) => a + b, 0)

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-red-400 font-semibold">{error}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>Asegúrate de que el backend esté corriendo en el puerto 8080</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={fetchData}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
          Reintentar conexión
        </motion.button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Panel de Control</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
            Sistema de Gestión de Semáforos Inteligentes · Patrón State
          </p>
        </div>
        {lastUpdate && (
          <div className="shrink-0 text-right hidden sm:block">
            <div className="flex items-center gap-1.5 justify-end">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-400"
              />
              <span className="text-xs font-medium text-green-400">En vivo</span>
            </div>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-3)' }}>
              {lastUpdate.toLocaleTimeString('es-MX')}
            </p>
          </div>
        )}
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Intersecciones', value: intersections.length, icon: <GlobeIcon />, color:'#38bdf8', rgb:'56,189,248' },
          { label:'Semáforos Activos', value: `${activeCount}/${totalLights}`, icon: <LightIcon />, color:'#22c55e', rgb:'34,197,94' },
          { label:'Emergencias', value: emergencyCount, icon: <AlertIcon />, color: emergencyCount > 0 ? '#dc2626' : '#64748b', rgb: emergencyCount > 0 ? '220,38,38' : '100,116,139', pulse: emergencyCount > 0 },
          { label:'Transiciones', value: totalTransitions, icon: <SwapIcon />, color:'#a78bfa', rgb:'167,139,250' },
        ].map((card, i) => (
          <motion.div key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="relative rounded-2xl p-4 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(${card.rgb},0.1) 0%, rgba(${card.rgb},0.04) 100%)`,
              border: `1px solid rgba(${card.rgb},0.2)`,
            }}
          >
            {card.pulse && (
              <motion.div className="absolute inset-0 rounded-2xl"
                animate={{ opacity: [0, 0.12, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ background: card.color }}
              />
            )}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>{card.label}</p>
                <motion.p
                  key={String(card.value)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold mt-1.5 tabular-nums"
                  style={{ color: card.color }}
                >
                  {card.value}
                </motion.p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `rgba(${card.rgb},0.12)`, color: card.color }}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Emergency alert ── */}
      <EmergencyAlert intersections={intersections} />

      {/* ── Stats + State map ── */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Progress bars */}
          <div className="lg:col-span-2 rounded-2xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Distribución de Transiciones</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-2)' }}>
                {totalTransitions} total
              </span>
            </div>
            <div className="space-y-3">
              {Object.entries(stats).sort((a,b) => b[1]-a[1]).map(([state, count]) => {
                const meta = STATE_META[state] || { label: state, color: '#64748b' }
                const pct = totalTransitions > 0 ? (count / totalTransitions) * 100 : 0
                return (
                  <div key={state} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-36 shrink-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.color }} />
                      <span className="text-xs truncate" style={{ color: 'var(--text-2)' }}>{meta.label}</span>
                    </div>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${meta.color}aa, ${meta.color})` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold w-8 text-right" style={{ color: meta.color }}>
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* State summary donut-style */}
          <div className="rounded-2xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold text-white mb-4">Estado Actual</h2>
            <div className="space-y-2">
              {Object.entries(
                allLights.reduce((acc, l) => {
                  acc[l.currentState] = (acc[l.currentState] || 0) + 1
                  return acc
                }, {})
              ).map(([state, count]) => {
                const meta = STATE_META[state] || { label: state, color: '#64748b' }
                return (
                  <div key={state} className="flex items-center justify-between px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
                      <span className="text-xs" style={{ color: 'var(--text-2)' }}>{meta.label}</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums" style={{ color: meta.color }}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Intersection grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
            Intersecciones
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: 'rgba(56,189,248,0.08)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.15)' }}>
            {intersections.length} activas
          </span>
        </div>
        <IntersectionGrid intersections={intersections} onRefresh={fetchData} />
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 skeleton" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_,i) => <div key={i} className="h-24 skeleton" />)}
      </div>
      <div className="h-40 skeleton" />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(3)].map((_,i) => <div key={i} className="h-72 skeleton" />)}
      </div>
    </div>
  )
}

// Icons
function GlobeIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> }
function LightIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="3"/><circle cx="12" cy="7" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="17" r="2"/></svg> }
function AlertIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
function SwapIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg> }
