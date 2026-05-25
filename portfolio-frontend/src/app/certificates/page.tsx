'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, ExternalLink, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';

export interface ICertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  imageUrl: string;
  verificationUrl?: string;
}

// Local fallback certificates data in case backend server is offline
const LOCAL_BACKUP_CERTIFICATES: ICertificate[] = [
  {
    id: 'cert-1',
    name: 'Advanced React & 3D WebGL Development',
    issuer: 'Metaverse Dev Academy',
    issueDate: '2026-04-15',
    imageUrl: '/certs/react_webgl.png',
    verificationUrl: 'https://credly.com'
  },
  {
    id: 'cert-2',
    name: 'Cloud Solutions Architect Certification',
    issuer: 'Apex Cloud Solutions',
    issueDate: '2026-02-28',
    imageUrl: '/certs/cloud_arch.png',
    verificationUrl: 'https://credly.com'
  },
  {
    id: 'cert-3',
    name: 'Full-Stack TypeScript Engineering',
    issuer: 'Systemic Tech Academy',
    issueDate: '2025-11-10',
    imageUrl: '/certs/react_webgl.png',
    verificationUrl: 'https://credly.com'
  }
];

export default function Certificates() {
  const [certs, setCerts] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<ICertificate | null>(null);
  const [usingBackup, setUsingBackup] = useState<boolean>(false);

  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    setUsingBackup(false);
    try {
      const res = await fetch('http://localhost:5000/api/certificates');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setCerts(data);
      if (data.length > 0) {
        setSelectedCert(data[0]);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('Backend fetch failed, offering backup mock data:', errMsg);
      setError('Express API Server is currently offline or unreachable.');
    } finally {
      setLoading(false);
    }
  };

  const loadBackupData = () => {
    setCerts(LOCAL_BACKUP_CERTIFICATES);
    setSelectedCert(LOCAL_BACKUP_CERTIFICATES[0]);
    setUsingBackup(true);
    setError(null);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen px-6 lg:px-16 py-12 relative">
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-wrap justify-between items-end gap-4">
          <div>
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-2">{'// CREDENTIAL VERIFICATION'}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Professional <span className="text-gradient">Certificates</span>
            </h1>
          </div>
          <div className="font-mono text-[10px] text-slate-500 flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg select-none">
            <Cpu size={12} className="text-purple-400 animate-pulse" />
            <span>{'// Data streamed dynamically from independent Express API node.'}</span>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="animate-spin text-cyan-400" size={32} />
            <p className="font-mono text-xs text-slate-400 tracking-wider">Querying Express certificate endpoint...</p>
          </div>
        )}

        {!loading && error && (
          <div className="glass-panel p-8 rounded-2xl border-rose-500/20 max-w-xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
              <span className="text-rose-400 font-bold">!</span>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">API Connection Failed</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {error} To view the UI layout and features as intended, you can load the local backup static data.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button 
                onClick={fetchCertificates}
                className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-mono transition-all"
              >
                Retry Request
              </button>
              <button 
                onClick={loadBackupData}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-mono font-bold text-xs rounded-xl hover:opacity-95 transition-all shadow-md"
              >
                Load Local Static Backup
              </button>
            </div>
          </div>
        )}

        {/* Asymmetric Two-Column Split Layout */}
        {!loading && certs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive List (5 Columns) */}
            <div className="lg:col-span-5 space-y-3">
              {usingBackup && (
                <div className="p-3 mb-2 rounded-xl bg-amber-500/10 border border-amber-500/20 font-mono text-[9px] text-amber-400 text-center">
                  ⚠️ SYSTEM RUNNING ON LOCAL STATIC BACKUP DATABLOCK
                </div>
              )}
              
              {certs.map((cert) => {
                const isSelected = selectedCert?.id === cert.id;
                return (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-white/5 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                        : 'bg-black/40 border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Active highlight bar */}
                    {isSelected && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-400" />
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className={`text-sm font-bold transition-colors ${
                          isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}>
                          {cert.name}
                        </h3>
                        <p className="font-mono text-[10px] text-slate-400 flex items-center gap-1.5">
                          <Award size={12} className="text-cyan-400" />
                          {cert.issuer}
                        </p>
                        <p className="font-mono text-[9px] text-slate-500 flex items-center gap-1.5 pt-1">
                          <Calendar size={12} />
                          Issued: {cert.issueDate}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Sticky Preview Container (7 Columns) */}
            <div className="lg:col-span-7 lg:sticky lg:top-28 space-y-4">
              <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col h-full relative overflow-hidden">
                
                {/* Glow Overlay */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  {selectedCert ? (
                    <motion.div
                      key={selectedCert.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6 flex flex-col h-full"
                    >
                      {/* Interactive Image Frame */}
                      <div className="relative aspect-[4/3] w-full rounded-2xl border border-white/10 bg-black overflow-hidden flex items-center justify-center group shadow-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedCert.imageUrl}
                          alt={`${selectedCert.name} credential preview`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            // If backend URL fails (e.g. image serve error), load relative backup path
                            const target = e.target as HTMLImageElement;
                            if (selectedCert.id === 'cert-1' || selectedCert.id === 'cert-3') {
                              target.src = '/certs/react_webgl.png';
                            } else {
                              target.src = '/certs/cloud_arch.png';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="font-mono text-[9px] text-slate-300">PREVIEW ZOOM ACTIVE</span>
                        </div>
                      </div>

                      {/* Info & External Link Button */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div>
                          <h4 className="font-bold text-white tracking-wide text-sm">{selectedCert.name}</h4>
                          <span className="font-mono text-[10px] text-slate-400">{selectedCert.issuer}</span>
                        </div>

                        {selectedCert.verificationUrl && (
                          <a
                            href={selectedCert.verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-mono text-xs font-semibold tracking-wide transition-all shadow-md group"
                          >
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span>Verify Credential</span>
                            <ExternalLink size={12} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                      <Award size={36} className="mb-2 animate-pulse" />
                      <p className="font-mono text-xs">Select a certificate from the left list to inspect validation details.</p>
                    </div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
