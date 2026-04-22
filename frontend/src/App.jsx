import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, LogOut, User as UserIcon, LayoutDashboard, Database, Activity, Search } from 'lucide-react'
import Login from './pages/Login'
import Register from './pages/Register'
import Manufacturer from './pages/Manufacturer'
import Distributor from './pages/Distributor'
import Pharmacy from './pages/Pharmacy'
import Verification from './pages/Verification'
import Admin from './pages/Admin'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  const isVerifyPage = location.pathname.startsWith('/verify')

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {!isVerifyPage && (
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18 py-4">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="bg-primary-500/10 p-2 rounded-xl group-hover:bg-primary-500/20 transition-colors">
                  <ShieldCheck className="text-primary-500 w-7 h-7" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  MedTrack<span className="text-primary-500">.</span>
                </span>
              </Link>
              
              <div className="flex items-center gap-8">
                {!user ? (
                  <div className="flex items-center gap-4">
                    <Link to="/login" className="text-slate-400 hover:text-white font-medium transition">Sign In</Link>
                    <Link to="/register" className="btn-primary px-5 py-2.5 text-sm">Get Started</Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{user.role}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white leading-none mb-1">{user.username}</p>
                        <p className="text-[10px] text-slate-500 font-mono leading-none">{user.walletAddress.substring(0,6)}...{user.walletAddress.substring(38)}</p>
                      </div>
                      <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                        <LogOut size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<PageWrapper><Login setUser={setUser} /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/manufacturer" element={<PageWrapper><Manufacturer user={user} /></PageWrapper>} />
            <Route path="/distributor" element={<PageWrapper><Distributor user={user} /></PageWrapper>} />
            <Route path="/pharmacy" element={<PageWrapper><Pharmacy user={user} /></PageWrapper>} />
            <Route path="/verify/:id" element={<Verification />} />
            <Route path="/admin" element={<PageWrapper><Admin user={user} /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-600 text-sm">
            © 2026 MedTrack Blockchain Network. All records are cryptographically secured.
          </p>
        </div>
      </footer>
    </div>
  )
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
  >
    {children}
  </motion.div>
)

function Home({ user }) {
  const navigate = useNavigate()
  
  useEffect(() => {
    if (user) {
      if (user.role === 'Manufacturer') navigate('/manufacturer')
      else if (user.role === 'Distributor') navigate('/distributor')
      else if (user.role === 'Pharmacy') navigate('/pharmacy')
      else if (user.role === 'Admin') navigate('/admin')
    }
  }, [user, navigate])

  return (
    <div className="relative overflow-hidden pt-20 pb-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-primary-500/10 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-4 py-1.5 rounded-full mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Next-Gen Supply Chain</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Transparent Medicine <br />
            <span className="text-primary-500">Tracking on Blockchain</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Eliminate counterfeit pharmaceuticals with an immutable ledger. 
            Track every batch from manufacturing to the patient's hands with instant QR verification.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-10 py-4">
              Get Started for Free
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-10 py-4">
              Sign In to Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard 
            icon={<Database className="text-primary-400" size={32} />}
            title="Immutable Records"
            desc="Every transfer is signed and sealed on the Ethereum network, making fraud impossible."
          />
          <FeatureCard 
            icon={<Activity className="text-emerald-400" size={32} />}
            title="Real-time Tracking"
            desc="Monitor shipment status and ownership changes instantly across the global network."
          />
          <FeatureCard 
            icon={<Search className="text-purple-400" size={32} />}
            title="Instant Verification"
            desc="Patients scan QR codes to confirm medicine authenticity and view its entire journey."
          />
        </motion.div>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass-card p-8 text-left hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-2 group">
    <div className="bg-slate-950 border border-slate-800 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
)

export default App
