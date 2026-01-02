'use client';

import React, { useState, useEffect } from 'react';
import { encodeGhostPass, decodeGhostPass, GhostPassData } from '@/data/mnemonic';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'verify'>('generate');
  const [formData, setFormData] = useState<GhostPassData>({
    role: 2, // Default: User
    type: 0, // Default: Software
    name: 100,
    reserved1: 0,
    version: 1,
    model: 88,
    prodDate: 260102, // Placeholder
    actDate: 0,
    expiryDate: 2047, // Placeholder: Lifetime
    sku: 777,
    reserved2: 0,
  });

  const [phrase, setPhrase] = useState<string[]>([]);
  const [verifyPhrase, setVerifyPhrase] = useState<string>('');
  const [masterSecret, setMasterSecret] = useState<string>('ghost_onyx_2026');
  const [decodedResult, setDecodedResult] = useState<{ data: GhostPassData; valid: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ROLES = ['Developer', 'Administrator', 'User', 'Member'];
  const TYPES = ['Software', 'Hardware', 'Application'];

  const handleGenerate = () => {
    try {
      const result = encodeGhostPass(formData, masterSecret);
      setPhrase(result);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleVerify = () => {
    try {
      const words = verifyPhrase.split(/\s+/).filter(w => w.length > 0);
      const result = decodeGhostPass(words, masterSecret);
      setDecodedResult(result);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setDecodedResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-400 font-mono p-8 selection:bg-primary/20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex justify-between items-end border-b border-zinc-900 pb-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-white text-3xl font-black tracking-tighter uppercase italic">
                GhostPass <span className="text-primary">v8.1</span>
              </h1>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mt-2">Mnemonic Distribution System</p>
            </div>
            {/* Custom Salt Input */}
            <div className="flex items-center gap-3 bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/50 w-fit">
              <span className="text-[8px] uppercase font-bold text-zinc-600 px-2">Master Authority</span>
              <input
                type="password"
                value={masterSecret}
                onChange={(e) => setMasterSecret(e.target.value)}
                className="bg-transparent text-[10px] text-primary font-bold outline-none border-l border-zinc-800 pl-3 w-40"
                placeholder="Enter Secret Salt"
              />
            </div>
          </div>
          <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 h-fit">
            {['generate', 'verify'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-primary text-black' : 'text-zinc-600 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        {activeTab === 'generate' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Input Panel */}
            <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">1. Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: parseInt(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-white focus:border-primary outline-none"
                  >
                    {ROLES.map((r, i) => <option key={i} value={i}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">2. Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-white focus:border-primary outline-none"
                  >
                    {TYPES.map((t, i) => <option key={i} value={i}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">3. Name Index</label>
                  <input
                    type="number" min="0" max="2047"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-white focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2 opacity-30">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">4. Reserved (Future)</label>
                  <input type="text" disabled value="RESERVED" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">5. Version</label>
                  <input
                    type="number"
                    value={formData.version || ''}
                    onChange={(e) => setFormData({ ...formData, version: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-white focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">6. Model Code</label>
                  <input
                    type="number"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-white focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">7. Prod Date</label>
                  <input
                    type="number"
                    value={formData.prodDate || ''}
                    onChange={(e) => setFormData({ ...formData, prodDate: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-white focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">8. Activation</label>
                  <input
                    type="number"
                    value={formData.actDate || ''}
                    onChange={(e) => setFormData({ ...formData, actDate: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-white focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">9. Expiry (2047=LIFETIME)</label>
                  <input
                    type="number"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-white focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">10. SKU</label>
                  <input
                    type="number"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-white focus:border-primary outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleGenerate}
                className="w-full py-5 bg-primary text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all transform active:scale-[0.98]"
              >
                Assemble GhostPass Phrase
              </button>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">Generated GhostPass</label>
              <div className="grid grid-cols-2 gap-2 p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl min-h-[300px]">
                {phrase.length > 0 ? (
                  phrase.map((word, i) => (
                    <div key={i} className="flex gap-2 items-center bg-black/40 p-3 rounded border border-zinc-800/50">
                      <span className="text-[8px] text-zinc-700 w-4">{i + 1}.</span>
                      <span className={`text-[10px] font-bold ${i === 11 ? 'text-primary' : 'text-zinc-300'}`}>
                        {word}
                        {i === 11 && <span className="block text-[7px] opacity-40 uppercase">(Security)</span>}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex items-center justify-center text-[10px] text-zinc-700 italic">
                    Waiting for assembly...
                  </div>
                )}
              </div>
              {phrase.length > 0 && (
                <button
                  onClick={() => { navigator.clipboard.writeText(phrase.join(' ')); alert('Copied to clipboard!') }}
                  className="w-full text-[9px] uppercase font-bold text-zinc-500 hover:text-primary transition-colors"
                >
                  Copy All Words
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">Input Seed Phrase (12 Words)</label>
              <textarea
                value={verifyPhrase}
                onChange={(e) => setVerifyPhrase(e.target.value)}
                placeholder="abandon ability able about ..."
                className="w-full h-32 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-lg text-primary font-bold focus:border-primary outline-none transition-all"
              />
              <button
                onClick={handleVerify}
                className="w-full py-5 border border-zinc-800 text-zinc-400 font-bold uppercase text-xs tracking-[0.3em] hover:text-white hover:border-white transition-all"
              >
                Perform Security Scan
              </button>
            </div>

            {decodedResult && (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className={`p-4 text-center text-[11px] font-black uppercase tracking-[0.5em] rounded-lg border ${decodedResult.valid ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
                  {decodedResult.valid ? "✓ Security Check Passed" : "⚠ Invalid Checksum / Security Compromised"}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { l: "Role", v: ROLES[decodedResult.data.role] || `Idx ${decodedResult.data.role}` },
                    { l: "Type", v: TYPES[decodedResult.data.type] || `Idx ${decodedResult.data.type}` },
                    { l: "Name Idx", v: `#${decodedResult.data.name}` },
                    { l: "Version", v: `v${decodedResult.data.version}` },
                    { l: "Model", v: decodedResult.data.model },
                    { l: "Prod Date", v: decodedResult.data.prodDate },
                    { l: "Activation", v: decodedResult.data.actDate },
                    { l: "Expiry", v: decodedResult.data.expiryDate === 2047 ? "LIFETIME" : decodedResult.data.expiryDate },
                    { l: "SKU", v: decodedResult.data.sku },
                    { l: "Reserved", v: "READY" },
                  ].map((item, i) => (
                    <div key={i} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/40">
                      <p className="text-[8px] uppercase text-zinc-600 mb-2 font-bold">{item.l}</p>
                      <p className="text-xs text-white font-bold">{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-10 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] text-center font-bold uppercase tracking-widest">
                Error Trace: {error}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
