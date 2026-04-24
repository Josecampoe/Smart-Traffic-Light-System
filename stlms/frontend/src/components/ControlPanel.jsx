import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { trafficLightApi } from '../services/api'

const ACTIONS = [
  {
    id: 'next',
    label: 'Siguiente',
    fullLabel: 'Siguiente Estado',
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>,
    colors: { bg: 'linear-gradient(135deg,#1e40af,#2563eb)', glow: 'rgba(37,99,235,0.4)', border: 'rgba(59,130,246,0.3)' },
    disabledWhen: s => s === 'EMERGENCY' || s === 'OUT_OF_SERVICE',
  },
  {
    id: 'emergency',
    label: 'Emergencia',
    fullLabel: 'Activar Emergencia',
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    colors: { bg: 'linear-gradient(135deg,#991b1b,#dc2626)', glow: 'rgba(220,38,38,0.4)', border: 'rgba(239,68,68,0.3)' },
    disabledWhen: s => s === 'EMERGENCY',
  },
  {
    id: 'restore',
    label: 'Restaurar',
    fullLabel: 'Restaurar Estado',
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>,
    colors: { bg: 'linear-gradient(135deg,#14532d,#16a34a)', glow: 'rgba(22,163,74,0.4)', border: 'rgba(34,197,94,0.3)' },
    disabledWhen: s => s !== 'EMERGENCY' && s !== 'OUT_OF_SERVICE',
  },
  {
    id: 'maintenance',
    label: 'Mantenim.',
    fullLabel: 'Mantenimiento',
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    colors: { bg: 'linear-gradient(135deg,#374151,#4b5563)', glow: 'rgba(75,85,99,0.4)', border: 'rgba(107,114,128,0.3)' },
    disabledWhen: s => s === 'OUT_OF_SERVICE',
  },
]

export default function ControlPanel({ light, onUpdate, compact = false }) {
  const [loading, setLoading] = useState(null)

  async function handleAction(action) {
    setLoading(action.id)
    try {
      const fns = {
        next: () => trafficLightApi.nextState(light.id),
        emergency: () => trafficLightApi.emergency(light.id),
        restore: () => trafficLightApi.restore(light.id),
        maintenance: () => trafficLightApi.maintenance(light.id),
      }
      const res = await fns[action.id]()
      toast.success(`${light.name} → ${action.fullLabel}`)
      onUpdate(res.data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Transición no permitida')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className={`flex flex-wrap ${compact ? 'gap-1 mt-2' : 'gap-1.5 mt-3'}`}>
      {ACTIONS.map(action => {
        const disabled = action.disabledWhen(light.currentState) || loading !== null
        const isLoading = loading === action.id

        return (
          <motion.button
            key={action.id}
            whileHover={!disabled ? { scale: 1.04, y: -1 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={() => !disabled && handleAction(action)}
            disabled={disabled}
            title={action.fullLabel}
            className={`inline-flex items-center gap-1.5 font-semibold rounded-lg transition-all ${
              compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
            }`}
            style={disabled
              ? { background: 'rgba(15,26,46,0.8)', color: '#2a3a5a', border: '1px solid rgba(255,255,255,0.04)', cursor: 'not-allowed' }
              : {
                  background: action.colors.bg,
                  color: 'white',
                  border: `1px solid ${action.colors.border}`,
                  boxShadow: isLoading ? 'none' : `0 2px 10px ${action.colors.glow}`,
                  opacity: isLoading ? 0.7 : 1,
                }
            }
          >
            <span className="shrink-0">
              {isLoading
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                : action.icon
              }
            </span>
            {action.label}
          </motion.button>
        )
      })}
    </div>
  )
}
