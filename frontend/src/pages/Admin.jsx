import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Activity, ExternalLink, Search, Package, Server, Globe, ArrowUpRight } from 'lucide-react'
import { getProvider, getContract } from '../utils/blockchain'

function Admin({ user }) {
  const [stats, setStats] = useState({ totalMedicines: 0, totalTransfers: 0 })
  const [allMeds, setAllMeds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'Admin') return
    loadGlobalData()
  }, [user])

  const loadGlobalData = async () => {
    setLoading(true)
    try {
      const provider = getProvider()
      if (!provider) return
      const contract = await getContract(provider)
      
      const count = await contract.medicineCount()
      setStats({ ...stats, totalMedicines: Number(count) })
      
      const items = []
      for (let i = 1; i <= count; i++) {
        const m = await contract.medicines(i)
        items.push(m)
      }
      setAllMeds(items.reverse())
    } catch (err) {
      console.error("Error loading admin data:", err)
    }
    setLoading(false)
  }

  if (user?.role !== 'Admin') return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-500/10 p-6 rounded-3xl mb-6">
        <Shield className="text-red-500" size={64} />
      </div>
      <h2 className="text-3xl font-extrabold mb-2">Unauthorized Access</h2>
      <p className="text-slate-500 max-w-sm mx-auto">This terminal is restricted to MedTrack Network Administrators only.</p>
      <button onClick={() => window.history.back()} className="btn-secondary mt-8">Return to Safety</button>
    </div>
  )

  return (
    <div className="space-y-12 py-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Network <span className="text-primary-500">Infrastructure</span></h1>
          <p className="text-slate-500">Monitor blockchain health and global pharmaceutical flow.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Badge icon={<Server size={14} />} text="Hardhat Node: 127.0.0.1" color="text-primary-400" />
          <Badge icon={<Globe size={14} />} text="Chain ID: 31337" color="text-emerald-400" />
        </div>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registry" value={stats.totalMedicines} icon={<Package className="text-primary-500" />} />
        <StatCard title="Network Nodes" value="03" icon={<Users className="text-emerald-400" />} />
        <StatCard title="Global Lifecycle" value={allMeds.length * 3} icon={<Activity className="text-purple-400" />} />
        <StatCard title="Integrity Score" value="100%" icon={<Shield className="text-blue-400" />} />
      </div>

      {/* Global Activity Feed */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="text-primary-500" size={24} />
            Global Activity Feed
          </h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input type="text" placeholder="Search batch..." className="glass-input w-full pl-10 py-2 text-xs" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/30 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-8 py-4">Batch Identity</th>
                <th className="px-8 py-4">Current Custodian</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Network Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {allMeds.map((m, index) => (
                <motion.tr 
                  key={m.id.toString()} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-900/40 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-mono text-primary-500 font-bold">
                        #{m.id.toString()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 group-hover:text-primary-400 transition-colors">{m.name}</p>
                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">{m.batchNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users size={14} className="opacity-50" />
                      <span className="text-xs font-mono truncate max-w-[180px]">{m.currentOwner}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={Number(m.status)} />
                  </td>
                  <td className="px-8 py-6">
                    <a 
                      href={`/verify/${m.id.toString()}`} 
                      target="_blank" 
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                      Audit Record
                      <ArrowUpRight size={14} />
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {allMeds.length === 0 && (
          <div className="py-20 text-center text-slate-600">
            <p className="text-sm italic">No network activity detected in the current epoch.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 relative group overflow-hidden">
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        {React.cloneElement(icon, { size: 100 })}
      </div>
      <div className="bg-slate-950 border border-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const configs = [
    { text: "Manufactured", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500" },
    { text: "In Transit", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" },
    { text: "Received", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
    { text: "Sold", bg: "bg-slate-800", border: "border-slate-700", dot: "bg-slate-600" }
  ]
  const config = configs[status] || configs[0]
  return (
    <span className={`inline-flex items-center gap-1.5 ${config.bg} border ${config.border} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.text}
    </span>
  )
}

function Badge({ icon, text, color }) {
  return (
    <div className={`bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-2 ${color}`}>
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{text}</span>
    </div>
  )
}

export default Admin
