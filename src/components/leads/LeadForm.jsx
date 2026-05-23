import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronDown, ChevronUp, Save, FileText } from 'lucide-react';
import SitePhotoUploader from '../photos/SitePhotoUploader';

const schema = z.object({
  lead_type: z.enum(['Project', 'Retail'], { required_error: 'Lead type is required' }),
  source: z.enum(['Site Visit', 'Reference', 'Dealer', 'End Client', 'Architect/Interiors'], { required_error: 'Source selection is required' }),
  client_name: z.string().min(2, 'Client name must be provided'),
  contact_number: z.string().regex(/^[6-9]\d{9}$/, 'Provide a valid 10-digit primary mobile number'),
  city: z.string().min(2, 'Target city domain is required'),
  project_type: z.enum(['Bungalow', 'Apartments', 'Commercial', 'Office', 'Industrial', 'Hospital', 'Hotel', 'Retail Store'], { required_error: 'Project classification type is required' }),
  assigned_to: z.string().min(1, 'An assignment stakeholder target is mandatory'),
  status: z.string().default('New'),
});

const sectionsList = [
  { id: 'identity', title: '1. Lead Identity Context' },
  { id: 'client', title: '2. Customer Profile Details' },
  { id: 'project', title: '3. Construction Site Parameters' },
  { id: 'technical', title: '4. Structural Technical Requirements' },
  { id: 'photos', title: '5. Diagnostic Field Site Media' },
  { id: 'sales', title: '6. Sales Pipeline Status & Closure' },
];

export default function LeadForm() {
  const [openSections, setOpenSections] = useState({ identity: true, client: true });
  
  const { register, handleSubmit, formState: { errors, touchedFields }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'New', lead_type: 'Retail', project_type: 'Bungalow' }
  });

  const watchedFields = watch();
  
  const totalTrackedFields = ['lead_type', 'source', 'client_name', 'contact_number', 'city', 'project_type', 'assigned_to'];
  const completedFieldsCount = totalTrackedFields.filter(field => !!watchedFields[field]).length;
  const metricsProgressPercent = Math.round((completedFieldsCount / totalTrackedFields.length) * 100);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const onFormSubmit = (data) => {
    console.log('Validated Database Record Payload:', data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-5xl mx-auto space-y-6 pb-24 relative">
      
      <div className="sticky top-16 bg-white border-b border-slate-200 py-4 px-6 rounded-xl shadow-sm z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A2744]">Initialize Sales Procurement Blueprint</h1>
          <p className="text-xs text-slate-500 mt-0.5">Automated ID Reference Pipeline allocation: <span className="font-mono text-slate-700 bg-slate-100 px-1 rounded">LD/SV/26-27/XXXX</span></p>
        </div>
        <div className="w-full sm:w-64 flex items-center gap-3">
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-[#00C9A7] h-2.5 rounded-full transition-all duration-300" style={{ width: `${metricsProgressPercent}%` }}></div>
          </div>
          <span className="text-sm font-semibold text-slate-600 min-w-8 text-right">{metricsProgressPercent}%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button type="button" onClick={() => toggleSection('identity')} className="w-full px-6 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
          <span className="font-bold text-[#1A2744] text-sm tracking-wide uppercase">{sectionsList[0].title}</span>
          {openSections.identity ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </button>
        {openSections.identity && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Lead Type *</label>
              <select {...register('lead_type')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]">
                <option value="Retail">Retail Contract</option>
                <option value="Project">Commercial Project</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Lead Acquisition Source *</label>
              <select {...register('source')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]">
                <option value="">Select Channel Source...</option>
                <option value="Site Visit">Site Visit Engagement</option>
                <option value="Reference">Customer Reference</option>
                <option value="Dealer">Distribution Network Dealer</option>
                <option value="End Client">Direct End Client</option>
                <option value="Architect/Interiors">Architect / Interior Consultant</option>
              </select>
              {errors.source && <p className="text-red-500 text-xs mt-1.5">{errors.source.message}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button type="button" onClick={() => toggleSection('client')} className="w-full px-6 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
          <span className="font-bold text-[#1A2744] text-sm tracking-wide uppercase">{sectionsList[1].title}</span>
          {openSections.client ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </button>
        {openSections.client && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Primary Client Name *</label>
              <input type="text" {...register('client_name')} placeholder="e.g., Jindal Infrastructure" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]" />
              {errors.client_name && <p className="text-red-500 text-xs mt-1.5">{errors.client_name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Contact Account Number *</label>
              <input type="tel" {...register('contact_number')} placeholder="9876543210" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]" />
              {errors.contact_number && <p className="text-red-500 text-xs mt-1.5">{errors.contact_number.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Client Core Location City *</label>
              <input type="text" {...register('city')} placeholder="Mumbai" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]" />
              {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city.message}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button type="button" onClick={() => toggleSection('technical')} className="w-full px-6 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
          <span className="font-bold text-[#1A2744] text-sm tracking-wide uppercase">{sectionsList[3].title}</span>
          {openSections.technical ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </button>
        {openSections.technical && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Structural Alloy Base Material</label>
              <select {...register('material')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]">
                <option value="SS304">Stainless Steel Grade 304</option>
                <option value="SS316">Stainless Steel Grade 316 (Marine)</option>
                <option value="Aluminium">Structural T6 Aluminium Profile</option>
                <option value="MS">Mild Steel Architecture Panel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Glass Architectural Profiling</label>
              <select {...register('glass_type')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]">
                <option value="Toughened">Toughened Monolithic Monolayer</option>
                <option value="Laminated">Laminated Multi-layer PVB Bonded</option>
                <option value="Frosted">Translucent Acid-Etched/Frosted</option>
                <option value="Clear">Optically Clear Low-Iron Float Glass</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Base Installation Anchor Mount</label>
              <select {...register('mounting_type')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]">
                <option value="Top Mount">Top Structural Surface Anchor Mount</option>
                <option value="Side Mount">Fascia Side Cladding Mount</option>
                <option value="Core Drill">Core Drill Chemical Grout Solidification</option>
                <option value="U-Channel">Heavy-Duty Aluminum Recessed U-Channel</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button type="button" onClick={() => toggleSection('photos')} className="w-full px-6 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
          <span className="font-bold text-[#1A2744] text-sm tracking-wide uppercase">{sectionsList[4].title}</span>
          {openSections.photos ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </button>
        {openSections.photos && (
          <div className="p-6">
            <SitePhotoUploader leadId="staged-draft" />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button type="button" onClick={() => toggleSection('sales')} className="w-full px-6 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
          <span className="font-bold text-[#1A2744] text-sm tracking-wide uppercase">{sectionsList[5].title}</span>
          {openSections.sales ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </button>
        {openSections.sales && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Assign Pipeline Owner *</label>
              <input type="text" {...register('assigned_to')} placeholder="Sales Account Executive Specialist ID" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]" />
              {errors.assigned_to && <p className="text-red-500 text-xs mt-1.5">{errors.assigned_to.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Project Execution Context Status</label>
              <select {...register('status')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C9A7]">
                <option value="New">New Discovery Assessment</option>
                <option value="Contacted">Active Discovery Outreach</option>
                <option value="Site Visit Done">Technical Survey Complete</option>
                <option value="Quotation Sent">Commercial Valuation Submitted</option>
                <option value="Won">Contract Executed (Won)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-slate-200 p-4 shadow-xl flex justify-end gap-3 z-30 px-6">
        <button type="button" className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
          Draft State File
        </button>
        <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-[#1A2744] text-white font-semibold text-sm rounded-lg hover:bg-[#111A30] transition-colors shadow-sm">
          <Save className="h-4 w-4 text-[#00C9A7]" />
          Execute Blueprint
        </button>
      </div>
    </form>
  );
}
