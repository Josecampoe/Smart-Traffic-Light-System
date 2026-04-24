import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { historyApi } from '../services/api'
import StateHistoryTimeline from '../components/StateHistoryTimeline'

export default function History() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    historyApi.getAll(page, 20)
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Historial de Transiciones</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
            Registro completo de todos los cambios de estado del sistema
          </p>
        </div>
        {data && (
          <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(99,102,241,0.08)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.18)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            {data.totalElements} registros
          </div>
        )}
      </div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* Card header */}
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Registro de Actividad</p>
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>Ordenado por fecha descendente</p>
            </div>
          </div>

          {data && (
            <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
              <span>Página {data.number + 1} / {data.totalPages}</span>
            </div>
          )}
        </div>

        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_,i) => (
                <div key={i} className="h-10 skeleton" style={{ opacity: 1 - i * 0.08 }} />
              ))}
            </div>
          ) : (
            <>
              <StateHistoryTimeline transitions={data?.content || []} />

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-5"
                  style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                    Mostrando{' '}
                    <span className="font-semibold text-white">{data.number * 20 + 1}–{Math.min((data.number + 1) * 20, data.totalElements)}</span>
                    {' '}de{' '}
                    <span className="font-semibold text-white">{data.totalElements}</span>
                    {' '}registros
                  </p>
                  <div className="flex items-center gap-2">
                    <PaginationBtn onClick={() => setPage(p => Math.max(0, p-1))} disabled={data.first} label="← Anterior" />
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(data.totalPages, 5))].map((_,i) => (
                        <button key={i}
                          onClick={() => setPage(i)}
                          className="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
                          style={i === data.number
                            ? { background: 'linear-gradient(135deg,#1e40af,#2563eb)', color: 'white' }
                            : { background: 'rgba(255,255,255,0.04)', color: 'var(--text-3)', border: '1px solid var(--border)' }
                          }
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <PaginationBtn onClick={() => setPage(p => p+1)} disabled={data.last} label="Siguiente →" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function PaginationBtn({ onClick, disabled, label }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
      style={disabled
        ? { background: 'rgba(15,26,46,0.6)', color: '#1e3050', cursor: 'not-allowed', border: '1px solid var(--border)' }
        : { background: 'linear-gradient(135deg,#1e40af,#2563eb)', color: 'white', boxShadow: '0 2px 10px rgba(37,99,235,0.3)' }
      }
    >
      {label}
    </motion.button>
  )
}
