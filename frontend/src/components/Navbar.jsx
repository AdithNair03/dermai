import { Link, useLocation } from 'react-router-dom'
import { Activity } from 'lucide-react'
import clsx from 'clsx'

export default function Navbar() {
  const { pathname } = useLocation()
  const links = [
    { to: '/',         label: 'Home' },
    { to: '/analysis', label: 'Analyze' },
  ]
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Activity size={16} className="text-blue-400" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            Derm<span className="text-blue-400">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                pathname === to
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
