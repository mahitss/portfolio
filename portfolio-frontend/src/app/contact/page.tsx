'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Email regex helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Perform form validation
  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!form.name.trim()) tempErrors.name = 'Name or Company is required.';
    if (!form.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!isValidEmail(form.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!form.message.trim()) tempErrors.message = 'Message body is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('sending');
    setAlertMessage(null);
    setPreviewUrl(null);

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setAlertMessage('Message delivered straight to my inbox!');
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl);
        }
      } else {
        setStatus('error');
        setAlertMessage(data.error || 'Server rejected the message. Please check input parameters.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setStatus('error');
      setAlertMessage('Unable to connect to Express email node. Server might be offline.');
    }
  };

  // Auto-clear alert messages after 5 seconds
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setAlertMessage(null);
        if (status === 'success') {
          setStatus('idle');
          setPreviewUrl(null);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="min-h-screen px-6 lg:px-16 py-12 relative flex items-center">
      <div className="mx-auto max-w-7xl w-full relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Details & Alternatives (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-2">{'// SECURE GATEWAY'}</span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Let&apos;s build <span className="text-gradient">something</span> epic.
              </h1>
              <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
                Fill out the secure full-stack gateway form, and your proposal will compile and route directly into my email inbox via SMTP delivery.
              </p>
            </div>

            {/* Alternative Direct Channels */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Direct Pipelines</h3>
              <div className="space-y-3">
                <a
                  href="mailto:hello@mahit.dev"
                  className="flex items-center space-x-3 p-4 rounded-xl glass-panel border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all duration-300 group"
                >
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all">
                    <Mail size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Email Address</p>
                    <p className="text-xs text-slate-300 font-mono">hello@mahit.dev</p>
                  </div>
                </a>

                <a
                  href="https://linkedin.com/in/mahitss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-xl glass-panel border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all duration-300 group"
                >
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all">
                    <Linkedin size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">LinkedIn Profile</p>
                    <p className="text-xs text-slate-300 font-mono flex items-center gap-1">
                      linkedin.com/in/mahitss <ExternalLink size={10} className="text-slate-500" />
                    </p>
                  </div>
                </a>

                <a
                  href="https://github.com/mahitss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-xl glass-panel border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all duration-300 group"
                >
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                    <Github size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">GitHub Repository</p>
                    <p className="text-xs text-slate-300 font-mono flex items-center gap-1">
                      github.com/mahitss <ExternalLink size={10} className="text-slate-500" />
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphic Form (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 relative overflow-hidden bg-white/5 backdrop-blur-md">
              
              {/* Form header */}
              <div className="mb-6 border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-slate-500 uppercase">{'// SMTP PROTOCOL v1.0'}</span>
                <h2 className="font-bold text-white tracking-wide text-lg">Send Transmission</h2>
              </div>

              {/* Status Banner */}
              <AnimatePresence>
                {alertMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 mb-6 rounded-xl border flex items-start space-x-3 ${
                      status === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                    }`}
                  >
                    {status === 'success' ? (
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs font-light">
                      <p className="font-bold">{status === 'success' ? 'Delivery Success' : 'Transmission Failure'}</p>
                      <p className="text-[11px] text-slate-300 mt-1">{alertMessage}</p>
                      {status === 'success' && previewUrl && (
                        <a 
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-mono text-[10px] text-cyan-400 w-fit"
                        >
                          Open Ethereal Mail Preview <ExternalLink size={8} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name / Company Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="font-mono text-[10px] uppercase text-slate-400 block tracking-widest">
                    Name / Company
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    disabled={status === 'sending'}
                    className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono transition-all ${
                      errors.name ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="E.g. Elon Musk or Tesla Inc."
                  />
                  {errors.name && <p className="font-mono text-[10px] text-rose-500">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="font-mono text-[10px] uppercase text-slate-400 block tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    disabled={status === 'sending'}
                    className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono transition-all ${
                      errors.email ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="E.g. elon@spacex.com"
                  />
                  {errors.email && <p className="font-mono text-[10px] text-rose-500">{errors.email}</p>}
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="font-mono text-[10px] uppercase text-slate-400 block tracking-widest">
                    Message Body
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleInputChange}
                    disabled={status === 'sending'}
                    className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono transition-all resize-none ${
                      errors.message ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="Describe your engineering project details..."
                  />
                  {errors.message && <p className="font-mono text-[10px] text-rose-500">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`w-full font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden ${
                    status === 'sending'
                      ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-cyan-400 text-black hover:opacity-95 shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-[0.99]'
                  }`}
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-transparent border-purple-400 rounded-full animate-spin"></div>
                      <span>Routing Node Packet...</span>
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
