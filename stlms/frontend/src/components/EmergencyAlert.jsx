import { motion, AnimatePresence } from 'framer-motion'

export default function EmergencyAlert({ intersections }) {
  const emergencyLights = intersections
    .flatMap(i => i.trafficLights || [])
    .filter(l => l.currentState === 'EMERGENCY')

  return (
    <AnimatePresence>
      {emergencyLights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="overflow-hidden"
        >
          <div
            className="relative rounded-2xl overflow-hidden emergency-bg"
            style={{ border: '1px solid rgba(220,38,38,0.35)', boxShadow: '0 0 40px rgba(220,38,38,0.15), inset 0 0 40px rgba(220,38,38,0.05)' }}
          >
            {/* Animated top stripe */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent, #dc2626, transparent)' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            <div className="px-5 py-4 flex items-center gap-4">
              {/* Animated siren icon */}
              <div className="relative shrink-0">
                <motion.div className="absolute inset-0 rounded-full bg-red-500/20"
                  animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div className="absolute inset-0 rounded-full bg-red-500/15"
                  animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                />
                <div className="relative w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(185,28,28,0.5), rgba(220,38,38,0.3))', border: '1px solid rgba(239,68,68,0.4)' }}>
                  <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2"
                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </motion.svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-red-300 tracking-wide">
                  ¡ALERTA DE EMERGENCIA ACTIVA!
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {emergencyLights.map(l => (
                    <span key={l.id} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live badge */}
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.35)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                EN VIVO
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
