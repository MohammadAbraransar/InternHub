import React, { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../../context/GlobalContext';

const InterviewBot = () => {
    const { AI_DATA } = useGlobal();
    // Local state for the session to avoid global pollution until end
    // Actually, original code used global DB.ai. 
    // We'll use local state references to 'AI_DATA' structure but manage progress here.

    // We need to maintain the state machine in React state
    const [aiState, setAiState] = useState(AI_DATA.state); // idle, discovery, interview
    const [subState, setSubState] = useState(AI_DATA.subState);
    const [tempSelection, setTempSelection] = useState(AI_DATA.tempSelection);
    const [qIndex, setQIndex] = useState(0);
    const [history, setHistory] = useState([{ type: 'ai', text: `Welcome, ready for high-tech simulation? Ask me about <b>Architecture</b> or <b>Concurrency</b>.` }]);
    const [inputText, setInputText] = useState("");
    const [sessionData, setSessionData] = useState([]);
    const [score, setScore] = useState(0);

    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, [history]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        const userMsg = inputText.trim();
        const lower = userMsg.toLowerCase();

        // Add User Message
        setHistory(prev => [...prev, { type: 'user', text: userMsg }]);
        setInputText("");

        // Simulate Delay
        setTimeout(() => {
            let response = "";
            let nextState = aiState;
            let nextSub = subState;
            let nextQIndex = qIndex;

            // --- DISCOVERY ---
            if (aiState === "discovery") {
                if (subState === "company") {
                    const cos = Object.keys(AI_DATA.dataset);
                    const found = cos.find(c => lower.includes(c.toLowerCase()));
                    if (found) {
                        setTempSelection(prev => ({ ...prev, co: found }));
                        nextSub = "role";
                        response = `Neural Path <b>${found}</b> Locked. Identifying Role... Target? (${Object.keys(AI_DATA.dataset[found]).join(', ')})`;
                    } else {
                        response = `Company not found. Options: ${cos.join(' | ')}`;
                    }
                } else if (subState === "role") {
                    const rols = Object.keys(AI_DATA.dataset[tempSelection.co]);
                    const found = rols.find(r => lower.includes(r.toLowerCase()));
                    if (found) {
                        setTempSelection(prev => ({ ...prev, ro: found }));
                        nextSub = "round";
                        response = `Role <b>${found}</b> Established. Round Complexity: ${Object.keys(AI_DATA.dataset[tempSelection.co][found]).join(' | ')}`;
                    } else {
                        response = `Role? Options: ${rols.join(' | ')}`;
                    }
                } else if (subState === "round") {
                    const rounds = Object.keys(AI_DATA.dataset[tempSelection.co][tempSelection.ro]);
                    const found = rounds.find(r => lower.includes(r.toLowerCase()));
                    if (found) {
                        const selRound = found;
                        setTempSelection(prev => ({ ...prev, rd: selRound }));
                        nextState = "interview";
                        nextSub = "";
                        nextQIndex = 0;
                        const firstQ = AI_DATA.dataset[tempSelection.co][tempSelection.ro][selRound][0].q;
                        response = `<div class='text-indigo-400 font-black mb-4 uppercase tracking-[0.2em]'>Institutional Lockdown: Interview Active</div><b>Sequence 1:</b> ${firstQ}`;
                    } else {
                        response = `Invalid Round. Options: ${rounds.join(' | ')}`;
                    }
                }
            }
            // --- INTERVIEW ---
            else if (aiState === "interview") {
                const currentSet = AI_DATA.dataset[tempSelection.co][tempSelection.ro][tempSelection.rd];
                const currentQ = currentSet[qIndex];

                // Audit
                const isCorrect = currentQ.k.some(kw => lower.includes(kw));
                const newScore = score + (isCorrect ? (100 / currentSet.length) : 0);
                setScore(newScore);

                const thisMistakes = isCorrect ? [] : [`Failed to articulate Tier-1 keywords: ${currentQ.k.join(', ')}`];

                setSessionData(prev => [...prev, {
                    q: currentQ.q,
                    a: userMsg,
                    isCorrect,
                    mistakes: thisMistakes,
                    sol: currentQ.sol
                }]);

                response = `<div class='text-indigo-400 font-bold mb-2 uppercase tracking-tighter'>Synapse Link: ${isCorrect ? 'SYNCHRONIZED' : 'ASYNC_FAILURE'}</div>Checking next sequence...`;

                const nextIdx = qIndex + 1;
                if (nextIdx < currentSet.length) {
                    response += `<div class='mt-6 pt-4 border-t border-white/10'><b class='text-white text-base'>Next Question (${nextIdx + 1}/${currentSet.length}):</b> ${currentSet[nextIdx].q}</div>`;
                    nextQIndex = nextIdx;
                } else {
                    nextState = "report"; // Special state to show report
                    response = `
                        <div class='mt-8 pt-6 border-t border-indigo-500/30 text-center'>
                            <div class='text-emerald-400 font-black animate-pulse mb-6 uppercase tracking-widest italic'>Interview Complete</div>
                            <button id="report-btn" class='bg-emerald-600 px-8 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest'>Access Final Report</button>
                        </div>`;
                }
            }
            // --- IDLE ---
            else {
                if (AI_DATA.interviewTriggers.some(t => lower.includes(t))) {
                    nextState = "discovery";
                    nextSub = "company";
                    setScore(0);
                    setSessionData([]);
                    response = "<b>Discovery Protocol Initialized.</b> Targeted Company? (e.g., <b>Amazon, Google</b>)";
                } else if (AI_DATA.doubtTriggers.some(t => lower.includes(t)) || AI_DATA.conceptCloud.some(c => c.k.some(kw => lower.includes(kw)))) {
                    let bestMatch = null;
                    let maxScore = 0;
                    AI_DATA.conceptCloud.forEach(concept => {
                        let s = 0;
                        concept.k.forEach(kw => { if (lower.includes(kw)) s += (kw.length > 2 ? 5 : 1); });
                        if (s > 0) s += (s / concept.k.length);
                        if (s > maxScore) { maxScore = s; bestMatch = concept; }
                    });

                    if (bestMatch && maxScore > 0) {
                        response = `<div class='text-emerald-400 font-black mb-2 uppercase tracking-widest'>Neural Concept Solved</div>${bestMatch.r}`;
                    } else {
                        response = "Neural pathways expanding. I specialize in Java, Python, Web Dev. Refine query.";
                    }
                } else {
                    response = "Neural Matrix Idle. Ask a technical question or say <b>'Start Interview'</b>.";
                }
            }

            setAiState(nextState);
            setSubState(nextSub);
            if (aiState === "interview" && nextState === "interview") setQIndex(nextQIndex);

            setHistory(prev => [...prev, { type: 'ai', text: response }]);
        }, 1000);
    };

    if (aiState === "report") {
        return (
            <div className='tab-active space-y-8 animate-in zoom-in-95 duration-500 pb-20'>
                <div className='glass p-12 text-center relative overflow-hidden'>
                    <div className='absolute top-0 right-0 p-8 text-6xl opacity-10 font-black tracking-tighter'>T1 FINAL AUDIT</div>
                    <h2 className='text-4xl font-black mb-10 italic uppercase tracking-widest text-indigo-400'>Neural Synapse Report</h2>
                    <div className='flex justify-center items-end gap-2 mb-10'>
                        <span className='text-9xl font-black gradient-text'>{Math.round(score)}</span>
                        <span className='text-4xl font-bold text-slate-600 mb-4'>/100</span>
                    </div>
                    <div className='h-3 w-full bg-white/5 rounded-full mb-12 overflow-hidden'>
                        <div className='h-full gradient-bg' style={{ width: `${score}%` }}></div>
                    </div>

                    <div className="text-left max-w-4xl mx-auto space-y-4">
                        {sessionData.map((d, i) => (
                            <div key={i} className='bg-white/5 p-8 rounded-[2.5rem] border border-white/10'>
                                <p className='text-base font-bold text-white mb-2 italic'>"{d.q}"</p>
                                <p className='text-xs text-slate-300 mb-2'>You: {d.a}</p>
                                <p className='text-xs text-emerald-400 mb-2'>Sol: {d.sol}</p>
                                {!d.isCorrect && <p className='text-xs text-rose-400'>Mistakes: {d.mistakes.join(' ')}</p>}
                            </div>
                        ))}
                    </div>

                    <button onClick={() => { setAiState('idle'); setHistory([]); }} className='mt-12 bg-indigo-600 px-10 py-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest'>RE-INITIATE</button>
                </div>
            </div>
        );
    }

    return (
        <div className='glass h-[600px] flex flex-col'>
            <div ref={chatBoxRef} className='flex-1 p-8 space-y-6 overflow-y-auto text-sm'>
                {history.map((h, i) => (
                    <div key={i} className={`flex ${h.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div
                            className={`${h.type === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-none'} p-5 rounded-3xl max-w-lg shadow-lg`}
                            dangerouslySetInnerHTML={{ __html: h.text }}
                        ></div>
                    </div>
                ))}
            </div>
            <div className='p-6 border-t border-white/5'>
                <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder='Enter technical response...'
                    className='w-full bg-white/5 border-none p-5 rounded-full text-white focus:ring-2 ring-indigo-500 outline-none transition-all'
                />
            </div>
        </div>
    );
};

export default InterviewBot;
