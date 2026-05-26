'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Eye, Award, Mail, RefreshCw, Database, Terminal, Layout, MousePointer, Activity } from 'lucide-react';

interface MetricsData {
  pageViews: Record<string, number>;
  certificateClicks: Record<string, number>;
  messagesCount: number;
}

// Fallback metrics in case backend is offline
const MOCK_METRICS_DATA: MetricsData = {
  pageViews: {
    '/': 142,
    '/experience': 89,
    '/certificates': 124,
    '/contact': 53,
    '/metrics': 12
  },
  certificateClicks: {
    'cert-1': 48,
    'cert-2': 31,
    'cert-3': 22
  },
  messagesCount: 8
};

const CERT_NAME_MAP: Record<string, string> = {
  'cert-1': 'Advanced React & 3D WebGL Development',
  'cert-2': 'Cloud Solutions Architect Certification',
  'cert-3': 'Full-Stack TypeScript Engineering'
};

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [latency, setLatency] = useState<number | null>(null);
  const [usingMock, setUsingMock] = useState<boolean>(false);
  const [rawView, setRawView] = useState<boolean>(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const res = await fetch(`${backendUrl}/api/analytics/metrics`);
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      const data = (await res.json()) as MetricsData;
      
      // Ensure all standard routes exist in the response
      const pageViews = {
        '/': 0,
        '/experience': 0,
        '/certificates': 0,
        '/contact': 0,
        ...data.pageViews
      };
      
      const certificateClicks = {
        'cert-1': 0,
        'cert-2': 0,
        'cert-3': 0,
        ...data.certificateClicks
      };

      setMetrics({
        pageViews,
        certificateClicks,
        messagesCount: data.messagesCount || 0
      });
      setLatency(Date.now() - startTime);
      setUsingMock(false);
    } catch (err) {
      console.warn('[Metrics API] Failed to fetch live analytics, loading mock cache:', err);
      setMetrics(MOCK_METRICS_DATA);
      setUsingMock(true);
      setLatency(null);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchMetrics();
    // Record page view for this page too!
    const recordMetricsView = async () => {
      try {
        await fetch(`${backendUrl}/api/analytics/pageview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: '/metrics' })
        });
      } catch {
        // Silent catch
      }
    };
    recordMetricsView();
  }, [backendUrl, fetchMetrics]);


  const totalPageViews = metrics ? Object.values(metrics.pageViews).reduce((a, b) => a + b, 0) : 0;
  const totalCertClicks = metrics ? Object.values(metrics.certificateClicks).reduce((a, b) => a + b, 0) : 0;
  const maxPageView = metrics ? Math.max(...Object.values(metrics.pageViews), 1) : 1;
  const maxCertClicks = metrics ? Math.max(...Object.values(metrics.certificateClicks), 1) : 1;

  return (
    <div className="min-h-screen px-6 lg:px-16 py-12 relative">
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-wrap justify-between items-end gap-4">
          <div>
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-2">{'// TELEMETRY MONITOR'}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Application <span className="text-gradient">Metrics</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="font-mono text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-white/[0.02] hover:bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg select-none transition-all disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Metrics</span>
            </button>
            <div className="font-mono text-[10px] text-slate-500 flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg select-none">
              <Database size={12} className="text-purple-400" />
              <span>Flat-file database node active.</span>
            </div>
          </div>
        </div>

        {/* Server State Header Badge */}
        {usingMock && (
          <div className="p-4 mb-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-mono text-xs text-amber-400 flex items-center gap-2 max-w-xl">
            <Activity size={14} className="animate-pulse" />
            <span><strong>DEMONSTRATION MODE:</strong> Express microservice offline. Showing simulated database parameters.</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && !metrics && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <RefreshCw className="animate-spin text-cyan-400" size={32} />
            <p className="font-mono text-xs text-slate-400">Syncing analytics database tables...</p>
          </div>
        )}

        {/* Content Panel */}
        {metrics && (
          <div className="space-y-8">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Page Views */}
              <div className="glass-panel p-6 rounded-2xl border-white/5 relative overflow-hidden bg-white/[0.01]">
                <div className="absolute top-4 right-4 w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/10">
                  <Eye size={18} className="text-cyan-400" />
                </div>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Total Route Operations</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">
                  {totalPageViews}
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-light">Accumulated path visits captured globally.</p>
              </div>

              {/* Card 2: Certificate clicks */}
              <div className="glass-panel p-6 rounded-2xl border-white/5 relative overflow-hidden bg-white/[0.01]">
                <div className="absolute top-4 right-4 w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/10">
                  <MousePointer size={18} className="text-purple-400" />
                </div>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Credential Inspections</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">
                  {totalCertClicks}
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-light">Interactive click selections inside `/certificates`.</p>
              </div>

              {/* Card 3: Sent Messages */}
              <div className="glass-panel p-6 rounded-2xl border-white/5 relative overflow-hidden bg-white/[0.01]">
                <div className="absolute top-4 right-4 w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/10">
                  <Mail size={18} className="text-emerald-400" />
                </div>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">SMTP Packages Transmitted</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">
                  {metrics.messagesCount}
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-light">Valid full-stack submissions parsed to mail.</p>
              </div>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Page Views Breakdown */}
              <div className="glass-panel p-6 rounded-3xl border-white/5 bg-white/[0.01] space-y-6">
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <Layout size={16} className="text-cyan-400" />
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">Page View Telemetry</h3>
                </div>

                <div className="space-y-4">
                  {Object.entries(metrics.pageViews).map(([path, val]) => {
                    const percentage = Math.round((val / maxPageView) * 100);
                    return (
                      <div key={path} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300">{path}</span>
                          <span className="text-cyan-400 font-bold">{val} <span className="text-slate-500 text-[10px] font-normal">views</span></span>
                        </div>
                        <div className="w-full bg-white/[0.02] border border-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Certificate Interactions Breakdown */}
              <div className="glass-panel p-6 rounded-3xl border-white/5 bg-white/[0.01] space-y-6">
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <Award size={16} className="text-purple-400" />
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">Credential Click Index</h3>
                </div>

                <div className="space-y-4">
                  {Object.entries(metrics.certificateClicks).map(([certId, val]) => {
                    const name = CERT_NAME_MAP[certId] || certId;
                    const percentage = Math.round((val / maxCertClicks) * 100);
                    return (
                      <div key={certId} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300 truncate max-w-[240px] md:max-w-[340px]" title={name}>{name}</span>
                          <span className="text-purple-400 font-bold">{val} <span className="text-slate-500 text-[10px] font-normal">clicks</span></span>
                        </div>
                        <div className="w-full bg-white/[0.02] border border-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-rose-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Live DB Structure and Latency Inspector */}
            <div className="glass-panel p-6 rounded-3xl border-white/5 bg-white/[0.01] space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-purple-400" />
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">File Database Inspector</h3>
                </div>
                <button
                  onClick={() => setRawView(!rawView)}
                  className="font-mono text-[10px] text-slate-400 hover:text-white underline transition-colors focus:outline-none"
                >
                  {rawView ? 'Hide Raw Schema' : 'Inspect Raw database.json'}
                </button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
                <div>
                  <span className="text-slate-500">Database Driver:</span> flat-json-service
                </div>
                <div>
                  <span className="text-slate-500">Target Path:</span> <code className="bg-black/30 border border-white/5 px-1.5 py-0.5 rounded text-[11px]">/portfolio-backend/database.json</code>
                </div>
                {latency !== null && (
                  <div>
                    <span className="text-slate-500">Query Speed:</span> <span className="text-emerald-400 font-bold">{latency}ms</span>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {rawView && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-black/60 border border-white/5 rounded-2xl font-mono text-[11px] text-emerald-400 overflow-x-auto select-all max-h-[300px] shadow-inner mt-4">
                      <pre>{JSON.stringify(metrics, null, 2)}</pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
