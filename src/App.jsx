import React, { useState } from 'react';
import { Shield, AlertTriangle, XOctagon, CheckCircle2, Loader2, Terminal, User, IndianRupee, Eye, EyeOff, Lock, History, ArrowLeft, HelpCircle } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard'); // dashboard, history
  const [status, setStatus] = useState('idle'); 
  const [logs, setLogs] = useState([]);
  const [reasons, setReasons] = useState([]); // Stores the exact AI rules for the "WHY?" button
  
  // App State
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  
  // Persistent Ledger
  const [history, setHistory] = useState([]);

  const CURRENT_BALANCE = 142050;
  const time = () => new Date().toLocaleTimeString('en-US', { hour12: false });

  const handleTransferInitiate = (e) => {
    e.preventDefault();
    if (!payee || !amount) return;
    setPinError('');
    setShowPinModal(true);
  };

  const processTransaction = (e) => {
    e.preventDefault();
    
    // STRICT PIN LOGIC
    if (pin !== '123456') {
      setPinError('Incorrect 6-digit PIN. Try again.');
      return;
    }
    
    setShowPinModal(false);
    setPin('');
    setPinError('');
    
    setStatus('analyzing');
    setLogs([`${time()} — Initializing GuardianAI Protocol...`]);
    setLogs(prev => [...prev, `${time()} — Target: ${payee} | Amount: ₹${amount}`]);

    const numAmount = parseFloat(amount.replace(/,/g, ''));
    let riskScore = 0;
    let auditTrail = []; // This feeds the "WHY?" explainability

    // REALISTIC BALANCE CHECK
    if (numAmount > CURRENT_BALANCE) {
      setTimeout(() => {
        setStatus('blocked');
        setReasons(['Amount requested exceeds available account balance.']);
        setLogs(prev => [
          ...prev, 
          `${time()} — [SYSTEM] Payment Failed: Insufficient Balance.`
        ]);
        saveToHistory('Failed (Balance)');
      }, 1500);
      return; 
    }

    // RISK ENGINE
    const knownPayees = ['sunita', 'rajesh', 'mishra', '@sbi', '@ybl', '@okaxis'];
    const payeeLower = payee.toLowerCase();
    
    setTimeout(() => {
      if (knownPayees.some(name => payeeLower.includes(name))) {
        riskScore -= 20;
        auditTrail.push(`[TRUST] Recipient matches historical/verified banking format.`);
      } else {
        riskScore += 45;
        auditTrail.push(`[ALERT] Unrecognized UPI Handle. No prior transaction history found.`);
      }
      setLogs(prev => [...prev, `${time()} — Fetching payee vector data...`]);
    }, 1500);

    setTimeout(() => {
      if (numAmount > 50000) {
        riskScore += 50;
        auditTrail.push(`[WARNING] Amount (₹${numAmount}) exceeds standard daily average by 400%.`);
      } else if (numAmount > 15000) {
        riskScore += 25;
        auditTrail.push(`[NOTE] Moderately high transaction volume detected.`);
      } else {
        auditTrail.push(`[SAFE] Amount is within normal behavioral parameters.`);
      }
      setLogs(prev => [...prev, `${time()} — Running velocity checks...`]);
    }, 3000);

    setTimeout(() => {
      setLogs(prev => [...prev, `${time()} — Calculating aggregate risk score: ${Math.max(0, riskScore)}/100`]);
      setReasons(auditTrail);
      
      if (riskScore >= 70) {
        setStatus('blocked');
        setLogs(prev => [...prev, `${time()} — 🚨 HIGH RISK: Payment PAUSED. Suspected Fraud.`]);
        saveToHistory('Blocked (Fraud Risk)');
      } else if (riskScore >= 40) {
        setStatus('warning');
        setLogs(prev => [...prev, `${time()} — ⚠️ MEDIUM RISK: Holding payment for Biometric/OTP confirmation.`]);
        saveToHistory('Hold (Pending OTP)');
      } else {
        setStatus('safe');
        setLogs(prev => [...prev, `${time()} — Transaction CLEARED. Payment successful.`]);
        saveToHistory('Success');
      }
    }, 4500);
  };

  const saveToHistory = (finalStatus) => {
    const newTx = { id: Math.random().toString(36).substr(2, 9), date: time(), payee, amount, status: finalStatus };
    setHistory(prev => [newTx, ...prev]);
  };

  const reset = () => {
    setStatus('idle');
    setLogs([]);
    setReasons([]);
    setPayee('');
    setAmount('');
  };

  const getGlow = () => {
    if (status === 'safe') return 'shadow-[0_0_50px_rgba(16,185,129,0.2)] border-emerald-500/50';
    if (status === 'warning') return 'shadow-[0_0_50px_rgba(249,115,22,0.3)] border-orange-500/60';
    if (status === 'blocked') return 'shadow-[0_0_60px_rgba(239,68,68,0.4)] border-red-500/80';
    if (status === 'analyzing') return 'shadow-[0_0_50px_rgba(56,189,248,0.2)] border-sky-500/50';
    return 'shadow-2xl border-slate-700/50';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200 selection:bg-emerald-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className={`w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border transition-all duration-700 relative h-[850px] flex flex-col z-10 ${getGlow()}`}>
        
        {/* Header */}
        <div className="p-6 pt-10 flex flex-col items-center border-b border-slate-800 bg-slate-900/50 relative">
          {view === 'history' && (
            <button onClick={() => setView('dashboard')} className="absolute left-6 top-10 p-2 bg-slate-800 rounded-full hover:bg-slate-700">
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
          )}
          <div className="relative">
            {status === 'idle' && <Shield className="w-16 h-16 text-emerald-400 mb-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />}
            {status === 'analyzing' && <Shield className="w-16 h-16 text-sky-400 mb-3 animate-pulse drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />}
            {status === 'safe' && <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />}
            {status === 'warning' && <AlertTriangle className="w-16 h-16 text-orange-500 mb-3 animate-pulse drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />}
            {status === 'blocked' && <XOctagon className="w-16 h-16 text-red-500 mb-3 animate-bounce drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />}
          </div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-1">GUARDIAN<span className="text-emerald-500">AI</span></h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide mt-1 uppercase">Banking Security Protocol</p>
        </div>

        <div className="flex-1 p-6 flex flex-col relative overflow-hidden">
          
          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && status === 'idle' && (
            <div className="space-y-6 mt-2 animate-in fade-in duration-500">
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">Available Balance</p>
                  <p className="text-2xl font-bold text-white flex items-center gap-2">
                    {showBalance ? '₹1,42,050.00' : '₹ • • • • • •'}
                  </p>
                </div>
                <button onClick={() => setShowBalance(!showBalance)} className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                  {showBalance ? <EyeOff className="w-5 h-5 text-slate-300" /> : <Eye className="w-5 h-5 text-slate-300" />}
                </button>
              </div>

              <form onSubmit={handleTransferInitiate} className="space-y-4 mt-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">UPI ID / Banking Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input type="text" required value={payee} onChange={(e) => setPayee(e.target.value)} placeholder="e.g., mishraji@ybl" className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5000" className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  Proceed to Pay
                </button>
              </form>

              <button onClick={() => setView('history')} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-all border border-slate-700 flex justify-center items-center gap-2">
                <History className="w-5 h-5" /> View Ledger History
              </button>
            </div>
          )}

          {/* HISTORY LEDGER VIEW */}
          {view === 'history' && (
            <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Transaction Ledger</h3>
              <div className="bg-black/60 rounded-2xl p-4 flex-1 border border-slate-700 overflow-y-auto space-y-3 shadow-inner">
                {history.length === 0 ? (
                  <p className="text-slate-500 text-center mt-10 text-sm">No transactions yet.</p>
                ) : (
                  history.map(tx => (
                    <div key={tx.id} className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold text-sm truncate w-32">{tx.payee}</p>
                        <p className="text-xs text-slate-400">{tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-sm">₹{tx.amount}</p>
                        <p className={`text-[10px] uppercase font-black tracking-wider ${tx.status.includes('Success') ? 'text-emerald-400' : tx.status.includes('Hold') ? 'text-orange-400' : 'text-red-400'}`}>
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ACTIVE LOG VIEW */}
          {status !== 'idle' && view === 'dashboard' && (
            <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Live Feed</h3>
                </div>
                
                {/* THE EXPLAINABILITY "WHY?" BUTTON */}
                {(status === 'blocked' || status === 'warning') && (
                  <button onClick={() => setShowWhyModal(true)} className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-600 flex items-center gap-1 shadow-lg animate-pulse">
                    <HelpCircle className="w-4 h-4" /> WHY?
                  </button>
                )}
              </div>
              
              <div className="bg-black/80 rounded-2xl p-5 flex-1 border border-slate-700 font-mono text-xs md:text-sm space-y-4 overflow-y-auto shadow-inner relative">
                {logs.map((log, index) => (
                  <div key={index} className={`transition-all duration-500 flex items-start gap-3 
                      ${log.includes('🚨') || log.includes('SYSTEM') || log.includes('Failed') ? 'text-red-400 font-bold' : 
                      log.includes('⚠️') ? 'text-orange-400 font-bold' :
                      log.includes('CLEARED') ? 'text-emerald-400 font-bold' : 'text-sky-400/80'}`}>
                    <span className="opacity-50 mt-0.5">❯</span><span>{log}</span>
                  </div>
                ))}
                {status === 'analyzing' && (
                  <div className="flex items-center gap-2 text-sky-500/80 mt-4 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /><span>Analyzing vectors...</span>
                  </div>
                )}
              </div>

              {status !== 'analyzing' && (
                <button onClick={reset} className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-600 shadow-lg">
                  Run New Simulation
                </button>
              )}
            </div>
          )}
        </div>

        {/* PIN MODAL */}
        {showPinModal && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-sm shadow-2xl flex flex-col items-center">
              <Lock className="w-12 h-12 text-emerald-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Enter UPI PIN</h2>
              <p className="text-sm text-slate-400 mb-6 text-center">To transfer ₹{amount} to {payee}</p>
              
              <form onSubmit={processTransaction} className="w-full">
                <input type="password" required maxLength="6" autoFocus value={pin} onChange={(e) => setPin(e.target.value)} placeholder="• • • • • •" className="w-full bg-slate-950 border border-slate-700 text-center text-white text-2xl tracking-[1em] rounded-xl py-4 focus:outline-none focus:border-emerald-500 transition-colors mb-2" />
                {pinError && <p className="text-red-400 text-xs text-center mb-4 font-bold">{pinError}</p>}
                {!pinError && <p className="text-transparent text-xs text-center mb-4 font-bold">Spacer</p>}
                
                <div className="flex gap-3 w-full">
                  <button type="button" onClick={() => {setShowPinModal(false); setPinError(''); setPin('');}} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all">Cancel</button>
                  <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EXPLAINABILITY "WHY?" MODAL */}
        {showWhyModal && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in zoom-in duration-200">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-sm shadow-2xl">
              <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                <HelpCircle className="w-5 h-5 text-sky-400" /> Risk Evidence
              </h2>
              <div className="space-y-4 mb-6">
                {reasons.map((reason, i) => (
                  <div key={i} className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className={`font-bold mr-2 ${reason.includes('TRUST') || reason.includes('SAFE') ? 'text-emerald-400' : reason.includes('WARNING') || reason.includes('NOTE') ? 'text-orange-400' : 'text-red-400'}`}>
                      {reason.split('] ')[0]}]
                    </span>
                    {reason.split('] ')[1]}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowWhyModal(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all">Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}