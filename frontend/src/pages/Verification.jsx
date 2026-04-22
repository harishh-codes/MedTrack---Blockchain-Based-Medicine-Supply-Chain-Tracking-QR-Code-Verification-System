import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, ShieldAlert, History, MapPin, Calendar, User, Package, CheckCircle2, Loader2, ArrowLeft, Activity, Info, Globe } from 'lucide-react'
import { getProvider, getContract } from '../utils/blockchain'
import { ethers } from 'ethers'

function Verification() {
  const { id } = useParams()
  const [medicine, setMedicine] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Public reading using JsonRpcProvider
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
      const contract = await getContract(provider)
      
      const m = await contract.medicines(id)
      if (!m.name) {
        setError("Invalid Registry ID. No medicine found on the blockchain for this ID.")
      } else {
        setMedicine(m)
        const h = await contract.getMedicineHistory(id)
        setHistory(h)
      }
    } catch (err) {
      console.error("Verification failed:", err)
      setError("Network Sync Error. Please ensure the MedTrack Blockchain nodes are online.")
    }
    setLoading(false)
  }

  const getStatusInfo = (status) => {
    const statuses = [
      { text: "Manufactured", color: "text-blue-400", bg: "bg-blue-400/10" },
      { text: "In Transit", color: "text-amber-400", bg: "bg-amber-400/10" },
      { text: "Received by Pharmacy", color: "text-emerald-400", bg: "bg-emerald-400/10" },
      { text: "Sold to Patient", color: "text-slate-400", bg: "bg-slate-400/10" }
    ]
    return statuses[Number(status)] || { text: "Unknown", color: "text-slate-400", bg: "bg-slate-400/10" }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-primary-500/10 border-t-primary-500 rounded-full animate-spin"></div>
        <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500" size={32} />
      </div>
      <p className="mt-8 text-slate-500 font-bold uppercase tracking-[0.3em] text-xs animate-pulse">Syncing with Ledger...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[3rem] mb-8 inline-block shadow-2xl shadow-red-500/10">
          <ShieldAlert className="text-red-500 mx-auto" size={80} />
        </div>
        <h2 className="text-4xl font-extrabold mb-4">Verification Error</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">{error}</p>
        <button onClick={() => window.location.href = '/'} className="btn-secondary flex items-center gap-2 mx-auto">
          <ArrowLeft size={18} /> Back to Portal
        </button>
      </motion.div>
    </div>
  )

  const status = getStatusInfo(medicine.status)

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Verification Header Hero */}
      <div className="relative pt-20 pb-32 px-4 overflow-hidden border-b border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl aspect-video bg-emerald-500/10 blur-[120px] rounded-full -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-2.5 rounded-full"
          >
            <ShieldCheck size={24} />
            <span className="font-extrabold uppercase tracking-[0.2em] text-sm">Product Authenticity Verified</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            {medicine.name}
          </motion.h1>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
              <Activity size={14} className="text-primary-500" />
              RECORD_ID: <span className="text-white font-bold">{id}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
              <Globe size={14} className="text-primary-500" />
              NETWORK: <span className="text-white font-bold text-emerald-400">ETHEREUM_LOCAL</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Detailed Specifications */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="glass-card p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -z-10 rounded-full"></div>
              
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <div className="bg-primary-500/10 p-2 rounded-xl">
                  <Package className="text-primary-500" size={20} />
                </div>
                Batch Specifications
              </h2>
              
              <div className="space-y-6">
                <SpecificationItem label="Batch Number" value={medicine.batchNumber} />
                <SpecificationItem label="Mfg Date" value={medicine.mfgDate} />
                <SpecificationItem label="Exp Date" value={medicine.expDate} accent="text-red-400" />
                <SpecificationItem label="Manufacturer" value={medicine.manufacturer} isAddress />
                <SpecificationItem label="Current Lifecycle" value={status.text} badge={status} />
              </div>
            </div>

            <div className="glass-card p-8 bg-primary-950/20 border-primary-500/20">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-primary-400">
                <Info size={20} /> Blockchain Security
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                This record is anchored to the decentralized ledger. Each transaction was cryptographically signed by verified network nodes.
              </p>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-8 shadow-2xl h-full">
              <h2 className="text-xl font-bold mb-10 flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-xl">
                  <History className="text-emerald-500" size={20} />
                </div>
                Supply Chain Provenance
              </h2>
              
              <div className="relative pl-10 border-l-2 border-slate-800 space-y-12">
                {history.map((step, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[51px] top-0 w-5 h-5 rounded-full border-4 border-slate-950 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h4 className="text-lg font-extrabold text-white">{step.details}</h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-900 border border-slate-800 px-2 py-1 rounded-md h-fit">
                          {new Date(Number(step.timestamp) * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 space-y-2">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-500 w-10 font-bold uppercase tracking-widest">From</span>
                          <span className="font-mono text-slate-300 truncate">{step.from === ethers.ZeroAddress ? "GENESIS_MANUFACTURER" : step.from}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-500 w-10 font-bold uppercase tracking-widest">To</span>
                          <span className="font-mono text-slate-300 truncate">{step.to}</span>
                        </div>
                      </div>
                      
                      <p className="text-[10px] text-slate-600 italic">
                        Timestamp: {new Date(Number(step.timestamp) * 1000).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function SpecificationItem({ label, value, isAddress, accent, badge }) {
  return (
    <div className="group border-b border-slate-800/50 pb-4 last:border-0">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-primary-500 transition-colors">{label}</p>
      {badge ? (
        <span className={`${badge.bg} ${badge.color} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
          {value}
        </span>
      ) : (
        <p className={`text-sm font-bold ${accent || 'text-white'} ${isAddress ? 'font-mono text-[11px] truncate leading-tight mt-1' : ''}`}>
          {value}
        </p>
      )}
    </div>
  )
}

export default Verification
