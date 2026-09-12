import React, { useState } from 'react';
import { Shield, AlertTriangle, XOctagon, CheckCircle2, Loader2, Terminal, User, IndianRupee, Eye, EyeOff, Lock, History, ArrowLeft, HelpCircle, Zap, Sparkles } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard'); 
  const [status, setStatus] = useState('idle'); 
  const [logs, setLogs] = useState([]);
  
  // App State
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showRiskPanel, setShowRiskPanel] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  
  // Upgraded Risk Evidence State
  const [riskSignals, setRiskSignals] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [llmSummary, setLlmSummary] = useState('');
  
  const [history, setHistory] = useState([]);

  const CURRENT_BALANCE = 142050;
  const time = () => new Date().toLocaleTimeString('en-US', { hour12: false });

  // --- DEMO AUTOMATION ENGINE ---
  const runDemo = (demoPayee, demoAmount) => {
    setPayee(demoPayee);
    setAmount(demoAmount.toString());
    // Auto-fill and bypass PIN for seamless live pitching
    executeTransaction(demoPayee, demoAmount.toString(), true);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!payee || !amount) return;
    setPinError('');
    setShowPinModal(true);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin !== '123456') {
      setPinError('Incorrect 6-digit PIN. Try again.');
      return;
    }
    setShowPinModal(false);
    setPin('');
    setPinError('');
    executeTransaction(payee, amount, false);
  };

  // --- CORE RISK ENGINE ---
  const executeTransaction = (txPayee, txAmount, isDemo) => {
    setStatus('analyzing');
    setLogs([`${time()} — Initializing GuardianAI Protocol...`, `${time()} — Target: ${txPayee} | Amount: ₹${txAmount}`]);

    const numAmount = parseFloat(txAmount.replace(/,/g, ''));
    let score = 0;
    let signals = [];
    let signalCount = 1;

    const addSignal = (title, points, desc) => {
      signals.push({ id: `0${signalCount}`, title, points, desc });
      score += points;
      signalCount++;
    };

    if (numAmount > CURRENT_BALANCE) {
      setTimeout(() => {
        setStatus('blocked');
        addSignal('INSUFFICIENT FUNDS', 100, 'Amount requested exceeds available account balance.');
        setRiskSignals(signals);
        setFinalScore(100);
        setLlmSummary("Transaction blocked immediately due to insufficient funds in the primary account.");
        setLogs(prev => [...prev, `${time()} — [SYSTEM] Payment Failed: Insufficient Balance.`]);
        saveToHistory(txPayee, txAmount, 'Failed (Balance)');
      }, 1500);
      return; 
    }

    const knownPayees = ['sunita', 'rajesh', 'mishra', '@sbi', '@ybl', '@okaxis', 'mom'];
    const payeeLower = txPayee.toLowerCase();
    
    setTimeout(() => {
      // THE AMAZON IMPERSONATION CHECK
      if (payeeLower === 'amizon') {
        addSignal('BRAND IMPERSONATION', 45, 'Recipient name closely resembles trusted brand "Amazon"');
        setLogs(prev => [...prev, `${time()} — [ALERT] Possible brand impersonation detected.`]);
      } 
      else if (knownPayees.some(name => payeeLower.includes(name))) {
        score -= 10;
        setLogs(prev => [...prev, `${time()} — [TRUST] Historical payee found.`]);
      } 
      else {
        addSignal('NEW RECIPIENT', 25, 'No previous successful transactions');
        setLogs(prev => [...prev, `${time()} — [ALERT] Unrecognized UPI Handle.`]);
      }
    }, 1500);

    setTimeout(() => {
      if (numAmount > 50000) {
        addSignal('AMOUNT ANOMALY', 30, `₹${txAmount} is ~4.2× normal range`);
        addSignal('VELOCITY ANOMALY', 20, 'Rapid transaction pattern detected');
        setLogs(prev => [...prev, `${time()} — [WARNING] Extreme volume spike.`]);
      } else if (numAmount > 10000) {
        addSignal('MODERATE VOLUME', 20, `Amount exceeds standard daily average`);
        setLogs(prev => [...prev, `${time()} — [NOTE] Moderately high transaction volume.`]);
      } else {
        setLogs(prev => [...prev, `${time()} — [SAFE] Amount within normal parameters.`]);
      }
    }, 3000);

    setTimeout(() => {
      const finalRiskScore = Math.max(0, score);
      setFinalScore(finalRiskScore);
      setRiskSignals(signals);
      
      setLogs(prev => [...prev, `${time()} — Calculating aggregate risk score: ${finalRiskScore}/100`]);
      
      if (finalRiskScore >= 70) {
        setStatus('blocked');
        setLlmSummary(`This transaction exhibits severe fraud indicators, including ${signals[0]?.title.toLowerCase()} and abnormal volume, warranting immediate suspension.`);
        setLogs(prev => [...prev, `${time()} — 🚨 HIGH RISK: Payment PAUSED. Suspected Fraud.`]);
        saveToHistory(txPayee, txAmount, 'Blocked (Fraud)');
      } else if (finalRiskScore >= 40) {
        setStatus('warning');
        setLlmSummary(`Moderate risk factors identified. The system requires secondary authentication to verify the user's intent.`);
        setLogs(prev => [...prev, `${time()} — ⚠️ MEDIUM RISK: Holding payment for OTP.`]);
        saveToHistory(txPayee, txAmount, 'Hold (OTP)');
      } else {
        setStatus('safe');
        setLogs(prev => [...prev, `${time()} — Transaction CLEARED. Payment successful.`]);
        saveToHistory(txPayee, txAmount, 'Success');
      }
    }, 4500);
  };

  const saveToHistory = (txPayee, txAmount, finalStatus) => {
    const newTx = { id: Math.random().toString(36).substr(2, 9), date: time(), payee: txPayee, amount: txAmount, status: finalStatus };
    setHistory(prev => [newTx, ...prev]);
  };

  const reset = () => {
    setStatus('idle');
    setLogs([]);
    setRiskSignals([]);
    setFinalScore(0);
    setLlmSummary('');
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
            <div className="space-y-5 mt-2 animate-in fade-in duration-500 overflow-y-auto pb-4">
              
              {/* JUDGE DEMO BUTTONS */}
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-sky-900/50">
                <p className="text-[10px] text-sky-400 font-bold mb-2 uppercase tracking-widest flex items-center gap-1"><Zap className="w-3 h-3"/> Quick Pitch Simulations</p>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => runDemo('Mom', '500')} className="bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 p-2 rounded-xl text-center transition-colors">
                    <p className="text-xs font-bold text-emerald-400">SAFE</p>
                    <p className="text-[10px] text-slate-400">₹500</p>
                  </button>
                  <button onClick={() => runDemo('Unknown_99', '11111')} className="bg-orange-950/40 hover:bg-orange-900/60 border border-orange-800/50 p-2 rounded-xl text-center transition-colors">
                    <p className="text-xs font-bold text-orange-400">MEDIUM</p>
                    <p className="text-[10px] text-slate-400">₹11,111</p>
                  </button>
                  <button onClick={() => runDemo('amizon', '90500')} className="bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 p-2 rounded-xl text-center transition-colors">
                    <p className="text-xs font-bold text-red-400">FRAUD</p>
                    <p className="text-[10px] text-slate-400">₹90,500</p>
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Available Balance</p>
                  <p className="text-xl font-bold text-white flex items-center gap-2">
                    {showBalance ? '₹1,42,050.00' : '₹ • • • • • •'}
                  </p>
                </div>
                <button onClick={() => setShowBalance(!showBalance)} className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  {showBalance ? <EyeOff className="w-4 h-4 text-slate-300" /> : <Eye className="w-4 h-4 text-slate-300" />}
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Payee Details</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" required value={payee} onChange={(e) => setPayee(e.target.value)} placeholder="e.g., mishraji@ybl" className="w-full bg-slate-950/50 border border-slate-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5000" className="w-full bg-slate-950/50 border border-slate-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                  Proceed to Pay
                </button>
              </form>

              <button onClick={() => setView('history')} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold py-3 rounded-xl transition-all border border-slate-700 flex justify-center items-center gap-2">
                <History className="w-4 h-4" /> View Ledger History
              </button>
            </div>
          )}

          {/* HISTORY LEDGER */}
          {view === 'history' && (
            <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Transaction Ledger</h3>
              <div className="bg-black/60 rounded-2xl p-4 flex-1 border border-slate-700 overflow-y-auto space-y-3 shadow-inner">
                {history.map(tx => (
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
                ))}
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
                
                {/* THE EXPLAINABILITY BUTTON */}
                {(status === 'blocked' || status === 'warning') && (
                  <button onClick={() => setShowRiskPanel(true)} className="bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 text-xs font-black tracking-widest py-1.5 px-4 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
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
              
              <form onSubmit={handlePinSubmit} className="w-full">
                <input type="password" required maxLength="6" autoFocus value={pin} onChange={(e) => setPin(e.target.value)} placeholder="• • • • • •" className="w-full bg-slate-950 border border-slate-700 text-center text-white text-2xl tracking-[1em] rounded-xl py-4 focus:outline-none focus:border-emerald-500 mb-2" />
                {pinError && <p className="text-red-400 text-xs text-center mb-4 font-bold">{pinError}</p>}
                {!pinError && <p className="text-transparent text-xs text-center mb-4 font-bold">Spacer</p>}
                
                <div className="flex gap-3 w-full">
                  <button type="button" onClick={() => {setShowPinModal(false); setPinError(''); setPin('');}} className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MERGED RISK EXPLAINABILITY PANEL */}
        {showRiskPanel && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex flex-col p-6 animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center mb-6 mt-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-wider">
                <Shield className="w-6 h-6 text-sky-400" /> RISK INTELLIGENCE
              </h2>
              <button onClick={() => setShowRiskPanel(false)} className="bg-slate-800 p-2 rounded-full text-white"><XOctagon className="w-5 h-5"/></button>
            </div>

            {/* Simulated LLM API Call Output */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 mb-6 shadow-inner">
              <p className="text-xs text-indigo-400 font-bold mb-2 flex items-center gap-1 uppercase tracking-widest"><Sparkles className="w-3 h-3"/> Gemini AI Summary</p>
              <p className="text-sm text-indigo-100 leading-relaxed">"{llmSummary}"</p>
            </div>

            {/* The Deterministic Rule Engine List */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-6">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Rule Engine Signals</p>
              {riskSignals.map((signal) => (
                <div key={signal.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-black text-white flex items-center gap-2">
                      <span className="text-slate-500 text-xs">{signal.id}</span> {signal.title}
                    </span>
                    <span className="text-red-400 font-bold text-sm">+{signal.points}</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">{signal.desc}</p>
                </div>
              ))}
            </div>

            {/* Footer Calculation */}
            <div className="border-t border-slate-800 pt-4 pb-2">
              <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-sm font-bold text-slate-400 tracking-widest">TOTAL SCORE:</span>
                <span className="text-2xl font-black text-white">{finalScore}/100</span>
              </div>
              <div className={`p-3 rounded-lg text-center text-xs font-bold uppercase tracking-wider ${finalScore >= 70 ? 'bg-red-950/50 text-red-400 border border-red-900/50' : 'bg-orange-950/50 text-orange-400 border border-orange-900/50'}`}>
                Guardian Recommendation: Verify recipient immediately.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}