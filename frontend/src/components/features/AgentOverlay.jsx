import React, { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';

const AgentOverlay = ({ navigate }) => { // Pass navigate to allow agent to redirect
    const { AI_DATA } = useGlobal();
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const txt = input.trim();
        const lower = txt.toLowerCase();
        setHistory(prev => [...prev, { type: 'user', text: txt }]);
        setInput("");

        setTimeout(() => {
            let response = "";
            if (AI_DATA.interviewTriggers.some(t => lower.includes(t))) {
                response = "Initializing <b>Global Discovery Protocol</b>. Redirecting to Interview Hub...";
                setTimeout(() => {
                    navigate("AI Interview");
                    setIsOpen(false);
                }, 1000);
            } else {
                // Fuzzy Logic
                let bestMatch = null;
                let maxScore = 0;
                AI_DATA.conceptCloud.forEach(cp => {
                    let score = 0;
                    cp.k.forEach(kw => { if (lower.includes(kw)) score += (kw.length > 2 ? 5 : 1); });
                    if (score > 0) score += (score / cp.k.length);
                    if (score > maxScore) { maxScore = score; bestMatch = cp; }
                });

                if (bestMatch && maxScore > 0) {
                    response = `<div class='text-emerald-400 font-black mb-1 uppercase text-[10px] tracking-widest'>Neural Synthesis</div>${bestMatch.r}`;
                } else {
                    response = "My neural dataset is expanding. Please ask about known technical topics.";
                }
            }
            setHistory(prev => [...prev, { type: 'ai', text: response }]);
        }, 800);
    };

    return (
        <>
            <div
                id="robust-agent-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-[30px] right-[30px] w-[70px] h-[70px] bg-gradient-to-br from-[#6366f1] to-[#f43f5e] rounded-[25px] flex items-center justify-center cursor-pointer z-[500] shadow-2xl hover:scale-110 hover:rotate-[10deg] transition-all"
            >
                <div className="w-8 h-8 text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full drop-shadow-lg">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div id="agent-panel" className="fixed bottom-[110px] right-[30px] w-[400px] h-[600px] z-[500] flex flex-col glass border-white/20 bg-[#020617]/95 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between gradient-bg rounded-t-[30px]">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            <span className="text-xs font-black uppercase tracking-widest text-white italic">Neural Robust Agent</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white opacity-50 hover:opacity-100 transition-all text-xl">✕</button>
                    </div>
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto text-xs scroll-smooth custom-scroll">
                        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 text-slate-300 leading-relaxed">
                            Greetings. I am your <b>Global Robust Agent</b>. Ask me <b>anything</b> technical or initiate an interview.
                        </div>
                        {history.map((h, i) => (
                            <div key={i} className={`flex ${h.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`${h.type === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'} p-3 rounded-2xl max-w-[85%]`} dangerouslySetInnerHTML={{ __html: h.text }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-white/5 border-t border-white/10">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Command the Neural Agent..."
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-indigo-500 transition-all text-xs"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default AgentOverlay;
