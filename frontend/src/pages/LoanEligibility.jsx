import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, XCircle, ChevronDown, Loader2, ExternalLink, IndianRupee, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getActiveApiUrl } from '../utils/mobileInit';

const API = getActiveApiUrl();

const CROPS = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Tomato', 'Potato', 'Onion', 'Groundnut', 'Soybean', 'Sugarcane', 'Chilli', 'Mustard', 'Bajra', 'Jowar', 'Chickpea', 'Lentil'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Puducherry'
];

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer gap-3">
      <span className="text-sm text-gray-300">{label}</span>
      <div onClick={onChange} className={`relative w-11 h-6 rounded-full transition-all ${checked ? 'bg-green-500' : 'bg-gray-600'}`}>
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'translate-x-5' : ''}`} />
      </div>
    </label>
  );
}

export default function LoanEligibility() {
  const [form, setForm] = useState({
    land_area_acres: '', annual_income: '', crop: 'Rice', state: 'Telangana',
    has_kisan_card: false, is_small_farmer: false, bank_account: true
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.land_area_acres) { toast.error('Please enter your land area'); return; }
    setLoading(true); setResult(null);
    try {
      const res = await axios.post(`${API}/loan-eligibility`, form);
      setResult(res.data.data);
    } catch { toast.error('Failed to check eligibility. Please try again.'); }
    finally { setLoading(false); }
  };

  const eligibleSchemes = result?.eligible_schemes?.filter(s => s.is_eligible) || [];
  const ineligibleSchemes = result?.eligible_schemes?.filter(s => !s.is_eligible) || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-4">
            <Building2 size={14} /> Government Schemes
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Loan & Scheme Eligibility Checker</h1>
          <p className="text-gray-400">Fill in your details to check which government schemes you qualify for</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-1 bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 h-fit">
            <h2 className="text-base font-semibold text-white mb-5">Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Land Area (Acres) *</label>
                <input type="number" step="0.1" min="0" placeholder="e.g. 2.5" value={form.land_area_acres}
                  onFocus={e => e.target.select()}
                  onClick={e => e.target.select()}
                  onChange={e => setField('land_area_acres', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Annual Income (₹)</label>
                <input type="number" placeholder="e.g. 120000" value={form.annual_income}
                  onFocus={e => e.target.select()}
                  onClick={e => e.target.select()}
                  onChange={e => setField('annual_income', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Main Crop</label>
                <div className="relative">
                  <select value={form.crop} onChange={e => setField('crop', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 appearance-none focus:outline-none focus:border-green-500">
                    {CROPS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-500" size={14} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">State</label>
                <div className="relative">
                  <select value={form.state} onChange={e => setField('state', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 appearance-none focus:outline-none focus:border-green-500">
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-500" size={14} />
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t border-gray-700">
                <Toggle label="Have Bank Account?" checked={form.bank_account} onChange={() => setField('bank_account', !form.bank_account)} />
                <Toggle label="Have Kisan Card?" checked={form.has_kisan_card} onChange={() => setField('has_kisan_card', !form.has_kisan_card)} />
                <Toggle label="Small/Marginal Farmer (< 2 Ha)?" checked={form.is_small_farmer} onChange={() => setField('is_small_farmer', !form.is_small_farmer)} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all text-sm">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Checking...</> : <><CheckCircle size={16} /> Check Eligibility</>}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            {result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">{result.eligible_count}</div>
                    <div className="text-xs text-gray-400 mt-1">Eligible Schemes</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-blue-400">{result.total_benefit_estimate}</div>
                    <div className="text-xs text-gray-400 mt-1">Total Estimated Benefit</div>
                  </div>
                </div>

                {/* KCC */}
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                  <IndianRupee className="text-yellow-400" size={20} />
                  <div>
                    <div className="text-sm font-medium text-yellow-400">Kisan Credit Card Limit</div>
                    <div className="text-xl font-bold text-white">{result.kcc_loan_limit} at 4% interest</div>
                  </div>
                </div>

                {/* Eligible Schemes */}
                {eligibleSchemes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <CheckCircle size={14} /> Eligible Schemes ({eligibleSchemes.length})
                    </h3>
                    <div className="space-y-3">
                      {eligibleSchemes.map(scheme => (
                        <div key={scheme.id} className="bg-gray-800/50 border border-green-500/20 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-sm font-semibold text-white">{scheme.name}</h4>
                            <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full shrink-0">✓ Eligible</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-3">{scheme.description}</p>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <div className="text-xs text-gray-500">Estimated Benefit</div>
                              <div className="text-sm font-bold text-green-400">{scheme.estimated_benefit}</div>
                            </div>
                            <a href={scheme.how_to_apply} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg transition-all">
                              <ExternalLink size={11} /> Apply Now
                            </a>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-700/50">
                            <div className="text-xs text-gray-500 mb-1">📄 Documents Needed:</div>
                            <div className="flex flex-wrap gap-1">
                              {scheme.documents_needed?.map(doc => (
                                <span key={doc} className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded-md">{doc}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><FileText size={14} /> Important Tips</h3>
                  <ul className="space-y-2">
                    {result.tips?.map((tip, i) => (
                      <li key={i} className="text-xs text-gray-300 flex gap-2">
                        <span className="text-green-400 shrink-0">💡</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 bg-gray-800/30 border border-gray-700/50 rounded-2xl text-center p-8">
                <Building2 className="text-gray-600 mb-3" size={40} />
                <p className="text-gray-500">Fill in your details on the left and check your eligibility for 12+ government schemes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
