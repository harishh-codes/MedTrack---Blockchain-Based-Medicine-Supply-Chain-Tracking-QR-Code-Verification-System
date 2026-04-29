import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, ShoppingCart, CheckCircle2, ShieldCheck, Activity, Loader2, Calendar, Package, Info } from 'lucide-react'
import { getProvider, getContract, requestAccount } from '../utils/blockchain'

function Pharmacy({ user }) {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    loadPharmacyStock()
  }, [])

  const loadPharmacyStock = async () => {
    try {
      const provider = getProvider()
      if (!provider) return
      const contract = await getContract(provider)
      
      const count = await contract.medicineCount()
      const items = []
      for (let i = 1; i <= count; i++) {
        const m = await contract.medicines(i)
        // Only show items currently owned by this pharmacy and not yet sold (Status 3 is Sold)
        if (m.currentOwner.toLowerCase() === user.walletAddress.toLowerCase() && Number(m.status) < 3) {
          items.push(m)
        }
      }
      setInventory(items.reverse())
    } catch (err) {
      console.error("Error loading stock:", err)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSale = async (id) => {
    setLoading(true)
    try {
      await requestAccount()
      const provider = getProvider()
      const signer = await provider.getSigner()
      const contract = await getContract(signer)

      // In our contract: Manufactured(0), InTransit(1), ReceivedByPharmacy(2), Sold(3)
      const tx = await contract.transferMedicine(id, user.walletAddress, "Medicine sold to patient", 3)
      await tx.wait()
      
      alert("Medicine marked as SOLD on blockchain!")
      loadPharmacyStock()
    } catch (err) {
      console.error("Sale failed:", err)
      alert("Transaction failed! Ensure your wallet is connected.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10 py-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Retail <span className="text-primary-500">Inventory</span></h1>
          <p className="text-slate-500">Manage authentic pharmaceutical stock for patient delivery.</p>
        </div>
        <div className="flex items-center gap-4 bg-primary-500/5 border border-primary-500/20 px-5 py-2.5 rounded-2xl">
          <Store className="text-primary-500" size={18} />
          <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.2em]">Storefront Active</span>
        </div>
      </header>

      {initialLoading ? (
        <div className="flex flex-col items-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <p className="text-slate-500 animate-pulse tracking-widest text-xs font-bold uppercase">Syncing Retail Ledger...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {inventory.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:col-span-3 glass-card flex flex-col items-center py-32 text-center border-dashed"
              >
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-6">
                  <Package size={64} className="text-slate-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Inventory Empty</h3>
                <p className="text-slate-500 max-w-sm">No medicines have been received by this pharmacy on the blockchain yet.</p>
              </motion.div>
            ) : (
              inventory.map((m, index) => (
                <motion.div 
                  key={m.id.toString()} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card flex flex-col hover:border-primary-500/40 transition-all duration-300 group"
                >
                  {/* Status & ID */}
                  <div className="flex justify-between items-start mb-6 p-6 pb-0">
                    <div className="bg-primary-500/10 p-3 rounded-2xl group-hover:bg-primary-500/20 transition-colors">
                      <ShieldCheck className="text-primary-500" size={28} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Batch ID</p>
                      <p className="text-lg font-mono font-bold text-primary-400 leading-none">#{m.id.toString()}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 space-y-6 flex-grow">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{m.name}</h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 size={14} /> Authentic
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-slate-900 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-800">
                          <Info size={14} /> {m.batchNumber}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                          <Calendar size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Expires</span>
                        </div>
                        <p className="text-sm font-bold text-red-400/80">{m.expDate}</p>
                      </div>
                      <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                          <Activity size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Status</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-400">Available</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <button 
                      onClick={() => handleSale(m.id)}
                      disabled={loading}
                      className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-base group-hover:scale-[1.02] transition-transform shadow-primary-500/10"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                          <ShoppingCart size={20} />
                          Mark as Delivered/Sold
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default Pharmacy
