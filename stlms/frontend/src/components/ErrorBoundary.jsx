import { Component } from 'react'

/**
 * React error boundary that catches unhandled render errors and displays
 * a fallback UI instead of crashing the entire application.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 p-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚠️
          </div>
          <div className="text-center">
            <p className="text-red-400 font-semibold">Ocurrió un error inesperado</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
              {this.state.error?.message || 'Error desconocido'}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)' }}
          >
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
