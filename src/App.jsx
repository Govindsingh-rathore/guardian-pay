import React, { useState } from 'react';
import { Shield, AlertTriangle, XOctagon, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function App() {
  // These states control the AI logic and the UI colors
  const [status, setStatus] = useState('idle'); // 'idle' | 'analyzing' | 'blocked'
  const [logs, setLogs] = useState([]);

  // The Agentic Guardian Logic Simulation
  const startTransaction = () => {
    setStatus('analyzing');
    
    // Grabbing a clean timestamp for realistic audit logs
    const time = () => new Date().toLocaleTimeString('en-US', { hour12: false });

    setLogs([`${time()} — Payment initiated: ₹50,000`]);
    
    // Simulating the AI taking time to analyze the risk
    setTimeout(() => {
      setLogs(prev => [...prev, `${time()} — Risk analysis started...`]);
    }, 1500);

    setTimeout(() => {
      setLogs(prev => [...prev, `${time()} — ALERT: New/Unverified recipient detected.`]);
    }, 3500);

    setTimeout(() => {
      setStatus('blocked');
      setLogs(prev => [
        ...prev, 
        `${time()} — High transaction volume mismatch.`,
        `${time()} — Payment PAUSED automatically.`,
        `${time()} — User notified.`
      ]);
    }, 5500);
  };

  const reset = () => {
    setStatus('idle');
    setLogs([]);
  };

  // Dynamic UI changing based on the AI's decision
  const getBgColor = () => {
    if (status === 'analyzing') return 'bg-yellow-950/40 border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.2)]';
    if (status === 'blocked') return 'bg-red-950/40 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]';
    return 'bg-slate-800 border-slate-700';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Sleek Smartphone Frame with Dynamic Glow */}
      <div className={`w-full max-w-md rounded-[2.5rem] overflow-hidden border-2 transition-all duration-700 relative h-[800px] flex flex-col ${getBgColor()}`}>
        
        {/* Dynamic App Header */}
        <div className="bg-slate-900/90 backdrop-blur-md p-6 flex flex-col items-center border-b border-slate-700/50 relative z-10">
          {status === 'idle' && <Shield className="w-14 h-14 text-emerald-400 mb-2 transition-all" />}
          {status === 'analyzing' && <AlertTriangle className="w-14 h-14 text-yellow-400 mb-2 animate-pulse" />}
          {status === 'blocked' && <XOctagon className="w-14 h-14 text-red-500 mb-2 animate-bounce" />}
          
          <h1 className="text-2xl font-bold tracking-wider">
            GUARDIAN<span className={status === 'blocked' ? 'text-red-500' : status === 'analyzing' ? 'text-yellow-400' : 'text-emerald-400'}>PAY</span>
          </h1>
          
          {/* Status Indicator */}
          <div className="mt-3 text-sm font-bold tracking-widest uppercase">
            {status === 'idle' && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> System Safe</span>}
            {status === 'analyzing' && <span className="text-yellow-400 flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin"/> Medium Risk Analysis</span>}
            {status === 'blocked' && <span className="text-red-500 flex items-center gap-1"><XOctagon className="w-4 h-4"/> High Risk - Blocked</span>}
          </div>
        </div>

        {/* Action Area */}
        <div className="flex-1 p-6 flex flex-col relative z-10 overflow-hidden">
          
          {/* Transaction Ticket */}
          <div className="bg-black/30 rounded-2xl p-6 mb-6 border border-slate-600/50 backdrop-blur-sm">
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Transfer To</p>
            <p className="text-white text-lg font-medium mb-4 flex items-center justify-between">
              Unknown_User_99 <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded shadow-inner">New Payee</span>
            </p>
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Amount</p>
            <p className="text-4xl font-bold text-white tracking-tight">₹50,000</p>
          </div>

          {/* Trigger Button */}
          {status === 'idle' && (
            <button 
              onClick={startTransaction}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-lg py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex justify-center items-center gap-2 mt-auto mb-4"
            >
              Confirm Payment <ArrowRight className="w-6 h-6" />
            </button>
          )}

          {/* Live Audit Log */}
          {status !== 'idle' && (
            <div className="mt-2 flex-1 flex flex-col min-h-0">
              <h3 className="text-slate-300 font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider text-sm">
                Live Agentic Audit Log
              </h3>
              <div className="bg-black/60 rounded-xl p-5 flex-1 border border-slate-700/50 font-mono text-sm space-y-4 overflow-y-auto">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`transition-all duration-500 ${log.includes('PAUSED') || log.includes('ALERT') ? 'text-red-400 font-bold' : 'text-emerald-400'}`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset Button */}
          {status === 'blocked' && (
            <button 
              onClick={reset}
              className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-600 flex justify-center items-center gap-2 shadow-lg"
            >
              Clear & Run New Scenario
            </button>
          )}

        </div>
      </div>
    </div>
  );
}