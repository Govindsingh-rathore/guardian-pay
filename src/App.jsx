import React, { useState } from 'react';
import { Shield, AlertTriangle, XOctagon, CheckCircle2, Loader2, Send, Activity, Terminal } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState('idle'); // idle, analyzing-safe, safe, analyzing-risk, blocked
  const [logs, setLogs] = useState([]);

  const time = () => new Date().toLocaleTimeString('en-US', { hour12: false });

  // SCENARIO 1: The Safe Payment (₹500 to Known Contact)
  const runSafeScenario = () => {
    setStatus('analyzing-safe');
    setLogs([`${time()} — Payment initiated: ₹500 to Mom`]);
    
    setTimeout(() => setLogs(prev => [...prev, `${time()} — Risk analysis started...`]), 1000);
    setTimeout(() => setLogs(prev => [...prev, `${time()} — Known recipient. Pattern normal.`]), 2500);
    setTimeout(() => {
      setStatus('safe');
      setLogs(prev => [...prev, `${time()} — Transaction CLEARED. Payment successful.`]);
    }, 4000);
  };

  // SCENARIO 2: The High-Risk Scam (₹50,000 to Unknown)
  const runRiskScenario = () => {
    setStatus('analyzing-risk');
    setLogs([`${time()} — Payment initiated: ₹50,000 to Unknown_User_99`]);
    
    setTimeout(() => setLogs(prev => [...prev, `${time()} — Risk analysis started...`]), 1000);
    setTimeout(() => setLogs(prev => [...prev, `${time()} — ALERT: Unverified recipient detected.`]), 2500);
    setTimeout(() => setLogs(prev => [...prev, `${time()} — WARNING: High volume mismatch.`]), 4000);
    setTimeout(() => {
      setStatus('blocked');
      setLogs(prev => [
        ...prev, 
        `${time()} — 🚨 INTERVENTION REQUIRED 🚨`,
        `${time()} — Payment PAUSED. User notified.`
      ]);
    }, 5500);
  };

  const reset = () => {
    setStatus('idle');
    setLogs([]);
  };

  // Dynamic Styling Engine
  const getGlow = () => {
    if (status.includes('safe') && status !== 'analyzing-safe') return 'shadow-[0_0_50px_rgba(16,185,129,0.2)] border-emerald-500/50';
    if (status === 'analyzing-risk' || status === 'analyzing-safe') return 'shadow-[0_0_50px_rgba(234,179,8,0.2)] border-yellow-500/50';
    if (status === 'blocked') return 'shadow-[0_0_60px_rgba(239,68,68,0.4)] border-red-500/80';
    return 'shadow-2xl border-slate-700/50';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200 selection:bg-emerald-500/30">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main App Container */}
      <div className={`w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border transition-all duration-700 relative h-[850px] flex flex-col z-10 ${getGlow()}`}>
        
        {/* Header */}
        <div className="p-6 pt-10 flex flex-col items-center border-b border-slate-800 bg-slate-900/50">
          <div className="relative">
            {status === 'idle' && <Shield className="w-16 h-16 text-emerald-400 mb-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />}
            {status.includes('analyzing') && <Activity className="w-16 h-16 text-yellow-400 mb-3 animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />}
            {status === 'blocked' && <XOctagon className="w-16 h-16 text-red-500 mb-3 animate-bounce drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />}
            {status === 'safe' && <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />}
          </div>
          
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-1">
            GUARDIAN<span className="text-emerald-500">AI</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide mt-1 uppercase">Banking Security Protocol</p>
        </div>

        {/* Dashboard / Action Area */}
        <div className="flex-1 p-6 flex flex-col relative overflow-hidden">
          
          {/* Idle State: Scenario Selection */}
          {status === 'idle' && (
            <div className="space-y-6 mt-4">
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                <p className="text-sm text-slate-400 font-semibold mb-1 uppercase">Current Balance</p>
                <p className="text-3xl font-bold text-white">₹1,42,050</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mt-8 mb-4">Run Simulation</h3>
                
                <button 
                  onClick={runSafeScenario}
                  className="w-full group bg-slate-800 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 text-white p-4 rounded-xl transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-700 group-hover:bg-emerald-500/20 p-3 rounded-lg transition-colors">
                      <Send className="w-5 h-5 group-hover:text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Send to Mom</p>
                      <p className="text-sm text-slate-400">₹500 • Known Payee</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={runRiskScenario}
                  className="w-full group bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/50 text-white p-4 rounded-xl transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-700 group-hover:bg-red-500/20 p-3 rounded-lg transition-colors">
                      <Send className="w-5 h-5 group-hover:text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Unknown_User_99</p>
                      <p className="text-sm text-slate-400">₹50,000 • New Payee</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Active State: The Agentic Audit Log */}
          {status !== 'idle' && (
            <div className="flex-1 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Live Security Feed</h3>
              </div>
              
              <div className="bg-black/80 rounded-2xl p-5 flex-1 border border-slate-700 font-mono text-sm space-y-4 overflow-y-auto shadow-inner relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
                
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`transition-all duration-500 flex items-start gap-3 
                      ${log.includes('🚨') || log.includes('PAUSED') || log.includes('WARNING') ? 'text-red-400 font-bold' : 
                      log.includes('CLEARED') ? 'text-emerald-400 font-bold' : 'text-emerald-500/80'}`}
                  >
                    <span className="opacity-50 mt-0.5">❯</span>
                    <span>{log}</span>
                  </div>
                ))}
                
                {status.includes('analyzing') && (
                  <div className="flex items-center gap-2 text-yellow-500/80 mt-4 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Agent analyzing vectors...</span>
                  </div>
                )}
              </div>

              {/* Reset Button */}
              {(status === 'blocked' || status === 'safe') && (
                <button 
                  onClick={reset}
                  className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-600 shadow-lg"
                >
                  Return to Dashboard
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}