import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import IntersectionDetail from './pages/IntersectionDetail'
import History from './pages/History'

const NAV = [
  { to: '/',          end: true, icon: GridIcon,  label: 'Panel de Control' },
  { to: '/historial',            icon: ClockIcon, label: 'Historial'        },
]

/** Maps route paths to their Spanish breadcrumb labels. */
const ROUTE_LABELS = {
  '/':           'Panel de Control',
  '/historial':  'Historial',
}

function getPageLabel(pathname) {
  return ROUTE_LABELS[pathname] ?? 'Detalle de Intersección'
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden city-grid scanlines" style={{ background: 'var(--bg-base)' }}>

      {/* ── Sidebar ── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="shrink-0 flex flex-col overflow-hidden z-30"
            style={{
              background: 'linear-gradient(180deg, #0a1628 0%, #060b14 100%)',
              borderRight: '1px solid var(--border)',
            }}
          >
            {/* Logo */}
            <div className="px-5 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #1e40af, #6d28d9)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                <TrafficIcon />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0a1628]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">STLMS</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>Control Center</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              <p className="text-xs font-semibold px-2 mb-3 uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
                Navegación
              </p>
              {NAV.map(({ to, end, icon: Icon, label }) => (
                <NavLink key={to} to={to} end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive ? 'text-white' : 'hover:text-white'
                    }`
                  }
                  style={({ isActive }) => isActive
                    ? { background: 'linear-gradient(135deg, rgba(30,64,175,0.4), rgba(109,40,217,0.3))', border: '1px solid rgba(99,102,241,0.3)', color: 'white' }
                    : { color: 'var(--text-2)', border: '1px solid transparent' }
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`transition-colors ${isActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                        <Icon />
                      </span>
                      {label}
                      {isActive && (
                        <motion.div layoutId="nav-indicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 pb-4 space-y-2">
              <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:text-white group"
                style={{ color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                <span className="text-slate-600 group-hover:text-slate-400"><ApiIcon /></span>
                API Docs
                <span className="ml-auto text-slate-700 group-hover:text-slate-500">↗</span>
              </a>
              <div className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-green-400">Sistema Activo</span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>Puerto 8080</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 flex items-center gap-4 px-6 h-14 glass z-20"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(v => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
            style={{ color: 'var(--text-2)' }}>
            <MenuIcon />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-3)' }}>
            <span className="text-white font-medium">
              {getPageLabel(location.pathname)}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <LiveClock />
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6 max-w-7xl mx-auto"
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/interseccion/:id" element={<IntersectionDetail />} />
                <Route path="/historial" element={<History />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#0f1a2e',
          color: '#e2e8f0',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          fontSize: '13px',
          padding: '12px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        },
        success: { iconTheme: { primary: '#22c55e', secondary: '#0f1a2e' } },
        error:   { iconTheme: { primary: '#ef4444', secondary: '#0f1a2e' } },
        duration: 3500,
      }} />
    </div>
  )
}

function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-right hidden sm:block">
      <p className="text-xs font-mono font-semibold text-white">
        {time.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
      <p className="text-xs" style={{ color: 'var(--text-3)' }}>
        {time.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' })}
      </p>
    </div>
  )
}

// ── Icons ──
function TrafficIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><circle cx="12" cy="7" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="17" r="2"/></svg>
}
function GridIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
}
function ClockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function ApiIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
}
function MenuIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
}
