import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, GitCompare, BarChart3, Compass, X, Plus, Network } from 'lucide-react'
import { useCompareStore } from '../../stores/useCompareStore'

const navLinks = [
  { to: '/', label: 'Explore', icon: Search },
  { to: '/rankings', label: 'Rankings', icon: BarChart3 },
  { to: '/discover', label: 'Discover', icon: Compass },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { selectedModels, removeModel, clearModels } = useCompareStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              <Network className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base hidden sm:block">
              <span className="text-white">Neural Node</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models…"
                className="input pl-9 h-9 text-sm"
              />
            </div>
          </form>

          {/* Nav links */}
          <div className="flex items-center gap-1 ml-2">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to && (to !== '/' || !location.search)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden lg:block">{label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex-1" />

          {/* Compare badge */}
          {selectedModels.length > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Link
                to="/compare"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(37,99,235,0.3))', border: '1px solid rgba(124,58,237,0.4)' }}
              >
                <GitCompare className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 hidden sm:block">Compare</span>
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
                  {selectedModels.length}
                </span>
              </Link>
            </motion.div>
          )}

          <div className="w-8" />
        </div>
      </motion.nav>

      {/* Compare floating bar */}
      <AnimatePresence>
        {selectedModels.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-glow-purple"
            style={{ border: '1px solid rgba(124,58,237,0.3)' }}
          >
            <div className="flex items-center gap-2">
              {selectedModels.map((m) => (
                <div key={m.id} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1">
                  <span className="text-xs text-white/70 max-w-[100px] truncate">{m.name}</span>
                  <button onClick={() => removeModel(m.id)} className="text-white/30 hover:text-white/70">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {selectedModels.length < 4 && (
                <div className="flex items-center gap-1 text-white/30 text-xs px-2">
                  <Plus className="w-3 h-3" />
                  <span>Add model</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 ml-2 border-l border-white/10 pl-3">
              <Link to="/compare" className="btn-primary text-xs py-1.5">
                <GitCompare className="w-3.5 h-3.5" />
                Compare
              </Link>
              <button onClick={clearModels} className="text-white/30 hover:text-white/60">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
