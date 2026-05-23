import React, { useState } from 'react';
import { 
  TrendingUp, Users, Target, Activity, 
  Search, Filter, Plus, FileSpreadsheet, 
  ArrowUpRight, Clock, MapPin, Phone
} from 'lucide-react';

const mockAnalytics = {
  totalPipelineValue: 4850000,
  activeLeadsCount: 142,
  conversionRate: 68.4,
  winLossRatio: '3.2:1'
};

const mockStageBreakdown = [
  { stage: 'New Discovery Assessment', count: 24, value: 720000, color: 'bg-blue-500' },
  { stage: 'Active Discovery Outreach', count: 38, value: 1140000, color: 'bg-amber-500' },
  { stage: 'Technical Survey Complete', count: 42, value: 1680000, color: 'bg-purple-500' },
  { stage: 'Commercial Valuation Sent', count: 22, value: 880000, color: 'bg-indigo-500' },
  { stage: 'Contract Executed (Won)', count: 16, value: 430000, color: 'bg-[#00C9A7]' },
];

const mockLeads = [
  { id: 'LD/SV/26-27/0001', name: 'Dr Dev Ramoliya', city: 'Kuvadava', contact: '7600420178', type: 'Project', material: 'SS304 Powder Coated', rft: 150, value: 400000, status: 'Negotiations' },
  { id: 'LD/SV/26-27/0002', name: 'Kishorbhai Radadiya', city: 'Rajkot', contact: '9426214041', type: 'Retail', material: 'Aluminium Profile', rft: 45, value: 135000, status: 'Site Visit Done' },
  { id: 'LD/SV/26-27/0003', name: 'Sanjaybhai Patel', city: 'Gondal', contact: '9825217311', type: 'Project', material: 'SS316 Glass Railing', rft: 210, value: 680000, status: 'Quotation Sent' },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A2744] tracking-tight">S&V Railing Procurement Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time commercial real estate and retail lead intelligence pipeline panel.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Export CSV Master
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1A2744] text-white font-semibold text-sm rounded-xl hover:bg-[#111A30] transition-all shadow-md group">
            <Plus className="h-4 w-4 text-[#00C9A7] group-hover:rotate-90 transition-transform" />
            Initialize Procurement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Valuation</p>
            <p className="text-2xl font-black text-[#1A2744]">₹{(mockAnalytics.totalPipelineValue / 100000).toFixed(1)}L</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Procurement Leads</p>
            <p className="text-2xl font-black text-[#1A2744]">{mockAnalytics.activeLeadsCount}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Efficiency</p>
            <p className="text-2xl font-black text-[#1A2744]">{mockAnalytics.conversionRate}%</p>
          </div>
          <div className="p-3 bg-emerald-50 text-[#00C9A7] rounded-xl">
            <Target className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Win / Loss Velocity</p>
            <p className="text-2xl font-black text-[#1A2744]">{mockAnalytics.winLossRatio}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Activity className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-[#1A2744] text-base">Active Operational Tracking Stream</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search clients, metrics, cities..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:bg-white focus:border-[#00C9A7] transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {mockLeads.map((lead) => (
              <div key={lead.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-all gap-4 group">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{lead.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${lead.type === 'Project' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}>{lead.type}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#00C9A7] transition-colors">{lead.name}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {lead.city}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.contact}</span>
                    <span className="text-slate-400 font-medium">Material: {lead.material}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right space-y-1 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 flex sm:flex-col justify-between sm:justify-center">
                  <span className="text-xs font-bold text-slate-400 block sm:inline uppercase tracking-wider">Value</span>
                  <p className="font-black text-slate-700 text-sm">₹{lead.value.toLocaleString('en-IN')}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-slate-600 ml-2 sm:ml-0 inline-block">{lead.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-[#1A2744] text-base border-b border-slate-100 pb-4">Pipeline Allocation Structure</h3>
          <div className="space-y-4">
            {mockStageBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">{item.stage} ({item.count})</span>
                  <span className="text-slate-800">₹{(item.value / 100000).toFixed(1)}L</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.value / mockAnalytics.totalPipelineValue) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
