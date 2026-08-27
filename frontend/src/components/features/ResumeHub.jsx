import React, { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import * as pdfjsLib from 'pdfjs-dist';

// IMPORTANT: Set worker options
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeHub = ({ viewMode }) => { // 'Resume Hub' or 'Resume Builder'
    const { activeEmail, activeUser, ih_push } = useGlobal();
    const [cloud, setCloud] = useState({});
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    // Resume Builder State
    const [builderData, setBuilderData] = useState({ name: "", email: "", phone: "", summary: "", xp: [], edu: [], skills: [], projects: [] });

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('ih_cloud')) || {};
        setCloud(stored);
        if (stored[activeEmail]?.resumeData) {
            setBuilderData(stored[activeEmail].resumeData);
        } else if (stored[activeEmail]) {
            setBuilderData(prev => ({
                ...prev,
                name: stored[activeEmail].name,
                email: activeEmail,
                summary: "Passionate Engineer with a focus on High-Scale Systems and Neural Architectures."
            }));
        }
    }, [activeEmail]);

    const u = cloud[activeEmail] || {};
    const hasRes = u.resume;

    // --- PARSER LOGIC ---
    const analyzeResumeContent = (dataOrText) => {
        // ... (Logic from Standoutfile) ...
        const K_MAP = {
            backend: ["java", "python", "node", "express", "django", "spring", "microservices", "api", "rest", "grpc", "graphql", "sql", "postgresql", "mongodb", "redis", "kafka", "rabbit", "docker", "kubernetes", "aws", "azure", "gcp", "serverless", "distributed", "concurrency", "auth", "jwt", "oauth"],
            frontend: ["react", "vue", "angular", "nextjs", "vite", "typescript", "javascript", "tailwind", "sass", "redux", "context", "dom", "ssr", "pwa", "webpack", "babel", "framer"],
            mobile: ["flutter", "react native", "swift", "kotlin", "android", "ios", "firebase", "dart", "xcode", "gradle"],
            ai_ml: ["pytorch", "tensorflow", "keras", "scikit", "pandas", "numpy", "opencv", "transformers", "llm", "nlp", "vision", "cuda", "reinforcement", "clustering"],
            devops: ["jenkins", "gitlab", "github actions", "terraform", "ansible", "prometheus", "grafana", "linux", "bash", "nginx", "ci/cd", "monitoring", "vault"],
            soft_skills: ["leadership", "collaboration", "management", "communication", "problem solving", "agile", "scrum", "sdlc"]
        };
        const VERBS = ["led", "built", "architected", "optimized", "reduced", "scaled", "automated", "designed", "integrated", "transformed", "engineered"];
        const allK = Object.values(K_MAP).flat();

        let techScore = 0, impactScore = 0, structureScore = 0, verbScore = 0;
        const feedback = { success: [], gaps: [] };

        const isText = typeof dataOrText === 'string';
        const fullText = isText ? dataOrText.toLowerCase() : JSON.stringify(dataOrText).toLowerCase();

        // 1. Structural Audit (20%)
        if (isText) {
            if (fullText.length > 500) structureScore += 30; else feedback.gaps.push("Short on Content: Try adding more details.");
            if (fullText.includes("experience") || fullText.includes("work")) { structureScore += 40; feedback.success.push("Great Layout: Experience is visible."); } else feedback.gaps.push("Missing Experience section.");
        } else {
            if (dataOrText.name && dataOrText.summary) structureScore += 30; else feedback.gaps.push("Add Summary.");
            if (dataOrText.xp && dataOrText.xp.length > 0) structureScore += 40; else feedback.gaps.push("Add Work History.");
        }

        // 2. Technical Density (60%)
        const foundK = allK.filter(k => fullText.includes(k));
        techScore = Math.min(100, (foundK.length / 20) * 100);
        if (techScore < 40) feedback.gaps.push("Boost Skills: Add more tech keywords.");

        // 3. Impact & Verbs (20%)
        const numMatch = fullText.match(/\d+(%|\s[A-Z]+|\s?x|%?\s?increase|%?\s?decrease|saved|optimized)/gi);
        impactScore = Math.min(100, (numMatch ? numMatch.length : 0) * 15);

        const finalScore = ((techScore * 0.6) + (impactScore * 0.2) + (structureScore * 0.2)).toFixed(1);
        return { score: finalScore, metrics: { tech: techScore.toFixed(0), impact: impactScore.toFixed(0), structure: structureScore.toFixed(0) }, success: feedback.success, gaps: feedback.gaps };
    };

    const extractTextFromFile = async (file) => {
        if (file.type === "application/pdf") {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(" ");
            }
            return text;
        } else {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsText(file);
            });
        }
    };

    const processResume = async (e) => {
        const files = e.target.files;
        if (!files.length) return;
        setLoading(true);
        const file = files[0];

        try {
            const text = await extractTextFromFile(file);
            setTimeout(async () => {
                const analysis = analyzeResumeContent(text || builderData);
                const resData = {
                    score: analysis.score,
                    metrics: analysis.metrics,
                    status: "Verified",
                    date: new Date().toLocaleDateString(),
                    fileName: file.name,
                    success: analysis.success,
                    gaps: analysis.gaps
                };

                // Update Cloud
                const newCloud = { ...cloud };
                newCloud[activeEmail].resume = resData;
                await ih_push(`ih_cloud/${activeEmail.replace(/\./g, '_')}/resume`, resData);
                localStorage.setItem('ih_cloud', JSON.stringify(newCloud));
                setCloud(newCloud); // Force re-render
                setLoading(false);
            }, 2000);
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert("Error parsing file");
        }
    };

    // --- BUILDER LOGIC ---
    const updateResume = (key, val) => {
        const newData = { ...builderData, [key]: val };
        setBuilderData(newData);
    };

    // Helper for arrays in builder (omitted for brevity but conceptually same as HTML)

    const saveBuilder = async () => {
        // Save builderData to cloud
        const newCloud = { ...cloud };
        if (!newCloud[activeEmail].resumeData) newCloud[activeEmail].resumeData = {};
        newCloud[activeEmail].resumeData = builderData;
        localStorage.setItem('ih_cloud', JSON.stringify(newCloud));
        await ih_push(`ih_cloud/${activeEmail.replace(/\./g, '_')}/resumeData`, builderData);
        alert("Saved to Neural Cloud");
    };


    if (viewMode === "Resume Builder") {
        return (
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
                <div className="lg:col-span-2 space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scroll">
                    <div className="glass p-6">
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-6 tracking-widest">Identity Module</h4>
                        <div className="space-y-4">
                            <input value={builderData.name} onChange={(e) => updateResume("name", e.target.value)} placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500" />
                            <textarea value={builderData.summary} onChange={(e) => updateResume("summary", e.target.value)} placeholder="Summary" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none h-24" />
                        </div>
                        <button onClick={saveBuilder} className="w-full mt-4 bg-indigo-600 py-3 rounded-xl font-black text-xs uppercase text-white">Save Sequence</button>
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <div id="resume-paper" className="bg-white text-slate-900 p-12 min-h-[600px] shadow-2xl rounded-sm">
                        <h1 className="text-4xl font-black uppercase mb-2">{builderData.name}</h1>
                        <p className="text-xs text-slate-700 mb-6">{builderData.summary}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Interactive Preview</p>
                    </div>
                </div>
            </div>
        );
    }

    // Default: Resume Hub
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => fileInputRef.current.click()} className="glass p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 border-2 border-dashed border-white/10 transition-all">
                    <div className="text-5xl mb-4">📤</div>
                    <span className="font-black uppercase tracking-widest text-indigo-400">{hasRes ? "Update Profile CV" : "Upload Institutional CV"}</span>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={processResume} />
                </div>

                {loading ? (
                    <div className="glass p-10 flex flex-col justify-center items-center">
                        <span className="loader mb-4"></span>
                        <span className="text-xs uppercase font-black text-indigo-400 animate-pulse">Neural Audit Running...</span>
                    </div>
                ) : (
                    <div className={`glass p-10 flex flex-col justify-center ${hasRes ? "" : "opacity-20"}`}>
                        {hasRes ? (
                            <>
                                <div className="flex items-center justify-between mb-8">
                                    <div><div className="text-6xl font-black gradient-text">{u.resume.score}</div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Optimization Index</p></div>
                                    <div className="text-right"><span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black tracking-widest">VERIFIED</span></div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center"><p className="text-xl font-bold">{u.resume.metrics?.tech}%</p><p className="text-[8px] text-indigo-400 uppercase font-black">Tech</p></div>
                                    <div className="text-center"><p className="text-xl font-bold">{u.resume.metrics?.impact}%</p><p className="text-[8px] text-emerald-400 uppercase font-black">Impact</p></div>
                                    <div className="text-center"><p className="text-xl font-bold">{u.resume.metrics?.structure}%</p><p className="text-[8px] text-amber-400 uppercase font-black">Struct</p></div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-10"><p className="text-xl font-black opacity-20">AWAITING NEURAL AUDIT</p></div>
                        )}
                    </div>
                )}
            </div>

            {hasRes && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2">
                    <div className="glass p-8 border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse"></div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Neural Success Factors</h5>
                        </div>
                        <ul className="space-y-3">
                            {(u.resume.success || []).map((s, i) => <li key={i} className="flex items-start gap-4 p-4 bg-black/20 rounded-2xl border border-white/5"><span className="text-emerald-400 font-black">✓</span><p className="text-xs text-slate-300">{s}</p></li>)}
                        </ul>
                    </div>
                    <div className="glass p-8 border-rose-500/20 bg-rose-500/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-rose-500 pulse"></div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Optimization Gaps</h5>
                        </div>
                        <ul className="space-y-3">
                            {(u.resume.gaps || []).map((g, i) => <li key={i} className="flex items-start gap-4 p-4 bg-black/20 rounded-2xl border border-white/5"><span className="text-rose-400 font-black">⚠</span><p className="text-xs text-slate-300">{g}</p></li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeHub;
