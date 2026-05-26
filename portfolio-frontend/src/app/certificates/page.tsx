'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Award, Calendar, ExternalLink, ShieldCheck, RefreshCw, Cpu, Terminal, ChevronDown, ChevronUp, Play, Copy, Check } from 'lucide-react';

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
    id: 'cert-gemini',
    name: 'Google Gemini AI Certification',
    issuer: 'Google',
    issueDate: '2026-05-15',
    imageUrl: '/certs/Gemini google.pdf',
    verificationUrl: 'https://grow.google'
  },
  {
    id: 'cert-hackathon',
    name: 'Snowflake Hackathon Certification of Excellence',
    issuer: 'Snowflake',
    issueDate: '2026-04-30',
    imageUrl: '/certs/snow hacathon certificate.pdf'
  },
  {
    id: 'cert-ml',
    name: 'Machine Learning Masterclass',
    issuer: 'Stanford Online / Coursera',
    issueDate: '2026-04-12',
    imageUrl: '/certs/Machine Learning.pdf'
  },
  {
    id: 'cert-ai',
    name: 'Artificial Intelligence Foundations',
    issuer: 'IBM',
    issueDate: '2026-03-20',
    imageUrl: '/certs/AI.pdf'
  },
  {
    id: 'cert-tata',
    name: 'Tata Virtual Experience Program',
    issuer: 'Tata Group',
    issueDate: '2026-02-28',
    imageUrl: '/certs/tata.pdf'
  },
  {
    id: 'cert-cyber',
    name: 'Cybersecurity Essentials',
    issuer: 'Cisco Networking Academy',
    issueDate: '2026-02-10',
    imageUrl: '/certs/cyber.pdf'
  },
  {
    id: 'cert-data',
    name: 'Data Analytics Specialization',
    issuer: 'Google Career Certificates',
    issueDate: '2026-01-15',
    imageUrl: '/certs/data analytics.pdf'
  }
];

export default function Certificates() {
  const [certs, setCerts] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<ICertificate | null>(null);
  const [usingBackup, setUsingBackup] = useState<boolean>(false);

  // Playground & Interactive API states
  const [showPlayground, setShowPlayground] = useState<boolean>(false);
  const [playgroundTab, setPlaygroundTab] = useState<'curl' | 'js'>('curl');
  const [playgroundOutput, setPlaygroundOutput] = useState<string>('');
  const [playgroundLoading, setPlaygroundLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUsingBackup(false);
    try {
      const res = await fetch(`${backendUrl}/api/certificates`);
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
  }, [backendUrl]);

  const loadBackupData = () => {
    setCerts(LOCAL_BACKUP_CERTIFICATES);
    setSelectedCert(LOCAL_BACKUP_CERTIFICATES[0]);
    setUsingBackup(true);
    setError(null);
  };

  const handleSelectCert = async (cert: ICertificate) => {
    setSelectedCert(cert);
    
    // Log click event inside the analytics engine
    try {
      await fetch(`${backendUrl}/api/analytics/certificate-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certId: cert.id }),
      });
    } catch (err) {
      console.warn('[Analytics] Failed to record certificate click:', err);
    }
  };

  const executePlaygroundRequest = async () => {
    setPlaygroundLoading(true);
    setPlaygroundOutput('');
    try {
      // Simulate real delay for visual verification
      await new Promise((resolve) => setTimeout(resolve, 600));
      const res = await fetch(`${backendUrl}/api/certificates`);
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      const data = await res.json();
      setPlaygroundOutput(`HTTP/1.1 200 OK\nContent-Type: application/json\n\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      console.warn('[Playground API] Failed live check, running fallback:', err);
      setPlaygroundOutput(
        `HTTP/1.1 200 OK (Local Backup Payload)\nContent-Type: application/json\n\n// API Node offline. Displaying local cache:\n${JSON.stringify(
          LOCAL_BACKUP_CERTIFICATES,
          null,
          2
        )}`
      );
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlCommand = `curl -X GET "${backendUrl}/api/certificates"`;
  const jsCode = `fetch('${backendUrl}/api/certificates')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);


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
                    onClick={() => handleSelectCert(cert)}
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
                      {/* Interactive Image Frame / PDF Viewer */}
                      <div className="relative aspect-[4/3] w-full rounded-2xl border border-white/10 bg-black overflow-hidden flex items-center justify-center group shadow-xl">
                        {selectedCert.imageUrl.toLowerCase().endsWith('.pdf') ? (
                          <iframe
                            src={`${selectedCert.imageUrl}#toolbar=0&navpanes=0`}
                            className="w-full h-full border-none rounded-xl"
                            title={`${selectedCert.name} PDF view`}
                          />
                        ) : (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={selectedCert.imageUrl}
                              alt={`${selectedCert.name} credential preview`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/certs/react_webgl.png';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <span className="font-mono text-[9px] text-slate-300">PREVIEW ZOOM ACTIVE</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Info & External Link Button */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div>
                          <h4 className="font-bold text-white tracking-wide text-sm">{selectedCert.name}</h4>
                          <span className="font-mono text-[10px] text-slate-400">{selectedCert.issuer}</span>
                        </div>

                        {selectedCert.verificationUrl ? (
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
                        ) : (
                          selectedCert.imageUrl.toLowerCase().endsWith('.pdf') && (
                            <a
                              href={selectedCert.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-mono text-xs font-semibold tracking-wide transition-all shadow-md group"
                            >
                              <ExternalLink size={12} className="text-cyan-400" />
                              <span>Open PDF Certificate</span>
                            </a>
                          )
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

        {/* Collapsible API Playground */}
        {!loading && (
          <div className="mt-12 glass-panel p-6 rounded-3xl border-white/5 relative overflow-hidden bg-white/[0.01]">
            <button
              onClick={() => setShowPlayground(!showPlayground)}
              className="w-full flex items-center justify-between font-mono text-sm tracking-wide text-white/95 focus:outline-none"
            >
              <div className="flex items-center space-x-2.5">
                <Terminal className="text-purple-400 animate-pulse" size={16} />
                <span>{'// DEVELOPER API ACCESS PLAYGROUND'}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 uppercase tracking-widest font-bold">
                  GET /api/certificates
                </span>
              </div>
              <div>
                {showPlayground ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            <AnimatePresence>
              {showPlayground && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-6 pt-6 border-t border-white/5 space-y-6"
                >
                  <p className="text-xs text-slate-400 leading-relaxed font-light max-w-3xl">
                    Query the portfolio backend REST API endpoint directly. Select a format below, copy the payload syntax to integrate into your application, or click <strong className="text-purple-400">Run Query</strong> to stream a live server transaction.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Panel: Request Snippet */}
                    <div className="lg:col-span-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                          <button
                            onClick={() => setPlaygroundTab('curl')}
                            className={`px-3 py-1 rounded font-mono text-[10px] uppercase transition-all ${
                              playgroundTab === 'curl'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            cURL
                          </button>
                          <button
                            onClick={() => setPlaygroundTab('js')}
                            className={`px-3 py-1 rounded font-mono text-[10px] uppercase transition-all ${
                              playgroundTab === 'js'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            JavaScript
                          </button>
                        </div>

                        <button
                          onClick={() => handleCopy(playgroundTab === 'curl' ? curlCommand : jsCode)}
                          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-[10px] font-mono"
                        >
                          {copied ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Block</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="relative font-mono text-[11px] p-4 rounded-2xl bg-black/50 border border-white/5 overflow-x-auto text-slate-300 leading-relaxed min-h-[110px] flex items-center">
                        <pre className="whitespace-pre">
                          {playgroundTab === 'curl' ? curlCommand : jsCode}
                        </pre>
                      </div>

                      <button
                        onClick={executePlaygroundRequest}
                        disabled={playgroundLoading}
                        className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-purple-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {playgroundLoading ? (
                          <>
                            <RefreshCw className="animate-spin text-black" size={14} />
                            <span>Request Resolving...</span>
                          </>
                        ) : (
                          <>
                            <Play size={10} fill="currentColor" />
                            <span>Run Live API Query</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right Panel: Output Terminal */}
                    <div className="lg:col-span-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-500 uppercase">{'// RESPONSE STDOUT'}</span>
                        <span className="font-mono text-[9px] text-slate-500">FORMAT: JSON</span>
                      </div>

                      <div className="relative aspect-[16/9] w-full rounded-2xl bg-black/60 border border-white/5 p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto leading-relaxed shadow-inner">
                        {playgroundLoading ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/40 backdrop-blur-[2px]">
                            <RefreshCw className="animate-spin text-purple-400" size={24} />
                            <span className="text-[10px] text-slate-400 tracking-wider">Awaiting server handshakes...</span>
                          </div>
                        ) : playgroundOutput ? (
                          <pre className="whitespace-pre-wrap">{playgroundOutput}</pre>
                        ) : (
                          <span className="text-slate-500 text-xs italic">
                            No response data captured yet. Press &quot;Run Live API Query&quot; to send transmission.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}

