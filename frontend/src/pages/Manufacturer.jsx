import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Package, QrCode, Calendar, Info, CheckCircle2, Activity, Loader2, X, ChevronRight } from 'lucide-react'
import { getProvider, getContract } from '../utils/blockchain'
import { QRCodeSVG } from 'qrcode.react'

function Manufacturer({ user }) {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showQR, setShowQR] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    mfgDate: '',
    expDate: ''
  })

  useEffect(() => {
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    try {
      const provider = getProvider()
      if (!provider) return
      const signer = await provider.getSigner()
      const contract = await getContract(signer)
      
      const count = await contract.medicineCount()
      const items = []
      for (let i = 1; i <= count; i++) {
        const m = await contract.medicines(i)
        if (m.manufacturer.toLowerCase() === user.walletAddress.toLowerCase()) {
          items.push(m)
        }
      }
      setMedicines(items.reverse())
    } catch (err) {
      console.error("Error loading medicines:", err)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const provider = getProvider()
      const signer = await provider.getSigner()
      const contract = await getContract(signer)

      const tx = await contract.addMedicine(
        formData.name,
        formData.batchNumber,
        formData.mfgDate,
        formData.expDate
      )
      await tx.wait()
      
      setFormData({ name: '', batchNumber: '', mfgDate: '', expDate: '' })
      loadMedicines()
    } catch (err) {
      console.error("Error adding medicine:", err)
      alert("Transaction failed! Ensure your wallet is connected to the correct network.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-10 py-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Manufacturer <span className="text-primary-500">Hub</span></h1>
          <p className="text-slate-500">Register and manage pharmaceutical batches on the blockchain.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 px-5 py-2.5 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Node Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Registration Form */}
        <div className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 sticky top-28"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary-500/10 p-2 rounded-lg">
                <Plus className="text-primary-500" size={20} />
              </div>
              <h2 className="text-xl font-bold">New Batch Registry</h2>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Medicine Name</label>
                <input
                  type="text"
                  className="glass-input w-full"
                  placeholder="e.g. Paracetamol XR"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Batch Number</label>
                <input
                  type="text"
                  className="glass-input w-full font-mono"
                  placeholder="BATCH-2026-X"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mfg Date</label>
                  <input
                    type="date"
                    className="glass-input w-full text-xs"
                    value={formData.mfgDate}
                    onChange={(e) => setFormData({ ...formData, mfgDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Exp Date</label>
                  <input
                    type="date"
                    className="glass-input w-full text-xs"
                    value={formData.expDate}
                    onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Register to Blockchain'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Batches List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Package className="text-emerald-500" size={20} />
            </div>
            <h2 className="text-xl font-bold">Registered Batches</h2>
          </div>
          
          {initialLoading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <p className="text-slate-500 animate-pulse">Syncing blockchain records...</p>
            </div>
          ) : medicines.length === 0 ? (
            <div className="glass-card flex flex-col items-center py-20 text-slate-600 border-dashed">
              <Package size={64} className="mb-4 opacity-10" />
              <p className="text-lg">No blockchain records found for this wallet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {medicines.map((m, index) => (
                  <motion.div 
                    key={m.id.toString()} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-700 hover:bg-slate-900/60 transition-all group"
                  >
                    <div className="flex items-center gap-5 w-full md:w-auto">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-primary-500 font-mono text-xs">
                        #{m.id.toString()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-primary-400 transition-colors">{m.name}</h3>
                        <div className="flex flex-wrap gap-4 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Info size={12} /> {m.batchNumber}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {m.mfgDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="bg-slate-950/50 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-bold text-red-400/70 uppercase">
                        Exp: {m.expDate}
                      </div>
                      <button 
                        onClick={() => setShowQR(m)}
                        className="p-3 bg-primary-500/10 text-primary-500 rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-lg shadow-primary-500/5"
                      >
                        <QrCode size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card max-w-sm w-full p-8 relative overflow-hidden text-center"
            >
              <button 
                onClick={() => setShowQR(null)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white rounded-lg transition"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <div className="bg-primary-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="text-primary-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold">{showQR.name}</h3>
                <p className="text-slate-500 text-sm mt-1 font-mono uppercase tracking-widest">Record ID: #{showQR.id.toString()}</p>
              </div>
              
              <div className="bg-white p-5 rounded-3xl inline-block shadow-2xl mb-8 group transition-transform hover:scale-105">
                <QRCodeSVG 
                  value={`${window.location.origin}/verify/${showQR.id.toString()}`} 
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  This QR code is cryptographically linked to the blockchain record. Scan to verify authenticity.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 break-all">
                  {window.location.origin}/verify/{showQR.id.toString()}
                </div>
                <button 
                  onClick={() => setShowQR(null)}
                  className="btn-primary w-full py-3 text-sm"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Manufacturer
