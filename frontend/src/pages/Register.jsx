import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Lock, Mail, Wallet, MapPin, Building2, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import axios from 'axios'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Manufacturer',
    walletAddress: '',
    details: { address: '', contact: '', licenseNumber: '' }
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        <div className="glass-card p-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold mb-3">Join MedTrack</h2>
            <p className="text-slate-500">Create your account to start tracking pharmaceuticals.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-8 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Account Info */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-primary-500 uppercase tracking-[0.2em] mb-4">Account Information</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="john_doe"
                    className="glass-input w-full pl-12"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="glass-input w-full pl-12"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">MetaMask Wallet</label>
                <div className="relative group">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="0x..."
                    className="glass-input w-full pl-12 font-mono text-xs"
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Organization Info */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-primary-500 uppercase tracking-[0.2em] mb-4">Organization Details</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Role in Network</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <select
                    className="glass-input w-full pl-12 appearance-none bg-slate-900"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Pharmacy">Pharmacy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Global Pharma St, NYC"
                    className="glass-input w-full pl-12"
                    value={formData.details.address}
                    onChange={(e) => setFormData({ ...formData, details: { ...formData.details, address: e.target.value } })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Medical License</label>
                <div className="relative group">
                  <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="LIC-123456"
                    className="glass-input w-full pl-12"
                    value={formData.details.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, details: { ...formData.details, licenseNumber: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg shadow-xl"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <UserPlus size={22} />
                    Create Network Identity
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Already a member? <Link to="/login" className="text-primary-400 font-bold hover:text-primary-300 transition">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
