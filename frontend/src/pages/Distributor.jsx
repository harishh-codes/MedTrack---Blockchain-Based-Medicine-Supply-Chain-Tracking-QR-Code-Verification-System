import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Truck, MapPin, CheckCircle2, AlertCircle, Package, ArrowRight, Wallet, History } from 'lucide-react'
import { getProvider, getContract } from '../utils/blockchain'

function Distributor({ user }) {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [searchId, setSearchId] = useState('')
  const [foundMed, setFoundMed] = useState(null)
  const [transferTo, setTransferTo] = useState('')

  useEffect(() => {
    loadAssignedMedicines()
  }, [])

  const loadAssignedMedicines = async () => {
    try {
      const provider = getProvider()
      if (!provider) return
      const signer = await provider.getSigner()
      const contract = await getContract(signer)
      
      const count = await contract.medicineCount()
      const items = []
      for (let i = 1; i <= count; i++) {
        const m = await contract.medicines(i)
        if (m.currentOwner.toLowerCase() === user.walletAddress.toLowerCase()) {
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

  const handleSearch = async () => {
    if (!searchId) return
    setLoading(true)
    setFoundMed(null)
    try {
      const provider = getProvider()
      const signer = await provider.getSigner()
      const contract = await getContract(signer)
      const m = await contract.medicines(searchId)
      if (m.name) {
        setFoundMed(m)
      } else {
        alert("Medicine not found in blockchain registry.")
      }
    } catch (err) {
      console.error("Search failed:", err)
      alert("Search failed. Ensure ID is numeric.")
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async (id, toAddress, status = 1) => {
    if (!toAddress) return alert("Please provide a valid receiver wallet address.")
    setLoading(true)
    try {
      const provider = getProvider()
      const signer = await provider.getSigner()
      const contract = await getContract(signer)

      const tx = await contract.transferMedicine(id, toAddress, "Ownership updated by Distributor", status)
      await tx.wait()
      
      alert("Blockchain transaction successful!")
      loadAssignedMedicines()
      setFoundMed(null)
      setSearchId('')
    } catch (err) {
      console.error("Transfer failed:", err)
      alert("Transaction failed! Verify the receiver address and your wallet connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10 py-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Logistics <span className="text-emerald-500">Node</span></h1>
          <p className="text-slate-500">Verify shipments and manage distribution logistics.</p>
        </div>
        <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 px-5 py-2.5 rounded-2xl">
          <Truck className="text-emerald-500" size={18} />
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Active Logistics</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search Section */}
        <div className="lg:col-span-5">
          <div className="glass-card p-8 sticky top-28 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Search className="text-primary-500" size={20} />
              Receive New Shipment
            </h2>

            <div className="flex gap-2 mb-8">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  className="glass-input w-full pl-4" 
                  placeholder="Record ID (e.g. 1)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
              </div>
              <button onClick={handleSearch} disabled={loading} className="btn-primary px-8 flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : 'Fetch'}
              </button>
            </div>

            <AnimatePresence>
              {foundMed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded">ID #{foundMed.id.toString()}</span>
                        <h3 className="text-lg font-bold">{foundMed.name}</h3>
                      </div>
                      <p className="text-slate-500 text-xs">Origin: {foundMed.manufacturer.substring(0,20)}...</p>
                    </div>
                    {foundMed.isAuthentic ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 size={14} /> Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <AlertCircle size={14} /> Suspicious
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <p className="text-slate-500 mb-1 uppercase tracking-widest font-bold">Current Owner</p>
                      <p className="truncate font-mono">{foundMed.currentOwner}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <p className="text-slate-500 mb-1 uppercase tracking-widest font-bold">Batch Ref</p>
                      <p className="truncate font-mono">{foundMed.batchNumber}</p>
                    </div>
                  </div>

                  {foundMed.currentOwner.toLowerCase() !== user.walletAddress.toLowerCase() ? (
                    <button 
                      onClick={() => handleTransfer(foundMed.id, user.walletAddress)} 
                      disabled={loading}
                      className="w-full btn-primary bg-emerald-600 hover:bg-emerald-500 border-none flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                          <CheckCircle2 size={18} />
                          Claim Ownership
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 text-xs font-bold">
                      You currently own this batch
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-500/10 p-2 rounded-lg">
              <Package className="text-primary-500" size={20} />
            </div>
            <h2 className="text-xl font-bold">Current Custody</h2>
          </div>
          
          {initialLoading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <p className="text-slate-500 animate-pulse">Scanning inventory...</p>
            </div>
          ) : medicines.length === 0 ? (
            <div className="glass-card flex flex-col items-center py-24 text-slate-600 border-dashed">
              <History size={64} className="mb-4 opacity-10" />
              <p className="text-lg">No items currently in your logistics custody.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {medicines.map((m, index) => (
                <motion.div 
                  key={m.id.toString()} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 border-l-4 border-l-emerald-500"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold">{m.name}</h4>
                          <p className="text-xs font-mono text-slate-500">Record ID: #{m.id.toString()}</p>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold uppercase">In Custody</span>
                      </div>
                      
                      <div className="flex gap-4 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><MapPin size={12} /> Registered Mfg: {m.manufacturer.substring(0,12)}...</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Batch: {m.batchNumber}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[240px] pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-800">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dispatch to Pharmacy</label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input 
                          type="text" 
                          placeholder="Pharmacy Wallet (0x...)" 
                          className="glass-input w-full text-[10px] pl-9 py-2"
                          onChange={(e) => setTransferTo(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => handleTransfer(m.id, transferTo)}
                        disabled={loading}
                        className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2 bg-slate-100 text-slate-950 hover:bg-white"
                      >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : (
                          <>
                            <ArrowRight size={16} />
                            Initiate Transfer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Distributor
