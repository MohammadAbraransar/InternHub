import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import ResumeHub from './ResumeHub';
import InterviewBot from './InterviewBot';

const HubContent = ({ currentTab, navigate }) => {
    const { globalSync, setGlobalSync, activeUser, cloudActive, ih_push } = useGlobal();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, [currentTab]);

    if (loading) {
        return (
            <div className='h-full flex flex-col items-center justify-center animate-in fade-in duration-500'>
                <span className='loader mb-8'></span>
                <p className='text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] animate-pulse'>Synchronizing Neural Link...</p>
            </div>
        );
    }

    // --- FEATURE HELPERS ---
    const deleteDrive = async (index) => {
        const newDrives = [...globalSync.drives];
        newDrives.splice(index, 1);
        const newSync = { ...globalSync, drives: newDrives };
        setGlobalSync(newSync); // Optimistic
        await ih_push('ih_global/drives', newDrives);
        alert("Drive Deactivated Globally.");
    };

    const addDrive = async () => {
        const title = prompt("Drive Title:");
        if (!title) return;
        const newDrive = { title: title.toUpperCase(), desc: "New Institutional Opportunity", status: "Active" };
        const newDrives = [...globalSync.drives, newDrive];
        setGlobalSync({ ...globalSync, drives: newDrives });
        await ih_push('ih_global/drives', newDrives);
    };

    const sendBroadcast = async () => {
        const msg = prompt("Global Message:");
        if (!msg) return;
        const b = { sender: activeUser.name, text: msg, time: new Date().toLocaleTimeString() };
        const newB = [...globalSync.broadcasts || [], b];
        setGlobalSync({ ...globalSync, broadcasts: newB });
        await ih_push('ih_global/broadcasts', newB);
        alert("Broadcast Sent.");
    };

    // --- VIEWS ---

    if (currentTab === "Readiness Stats") {
        return <div className='glass p-12 bg-indigo-600/10'><h4 className='text-8xl font-black'>92<span className='text-4xl text-slate-500'>.4%</span></h4><p className='text-sm text-indigo-400 font-bold mt-4 uppercase tracking-widest'>Neural Placement Index</p></div>;
    }

    if (currentTab === "AI Interview") return <InterviewBot />;
    if (currentTab === "Resume Hub" || currentTab === "Resume Builder") return <ResumeHub viewMode={currentTab} />;

    if (currentTab === "Job Board") {
        return (
            <div className='glass p-8 space-y-6'>
                <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-2xl font-black italic uppercase'>Live Institutional Vacancies</h3>
                    <span className='px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-black'>{globalSync.jobs.length} OPENING DETECTED</span>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                    {globalSync.jobs.map((j, i) => (
                        <div key={i} className='bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all group'>
                            <div className='flex justify-between mb-4'>
                                <span className={`text-xs font-black text-${j.color}-400 group-hover:scale-110 transition-transform origin-left`}>{j.co}</span>
                                <span className='text-[10px] bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full font-black'>{j.tier}</span>
                            </div>
                            <h4 className='text-lg font-bold mb-2 group-hover:text-white transition-colors'>{j.role}</h4>
                            <p className='text-xs text-slate-400 mb-6 line-clamp-2'>{j.desc}</p>
                            <button onClick={() => navigate("AI Interview")} className={`w-full bg-${j.color || "indigo"}-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110`}>Start Specialized Test</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (currentTab === "Drive Control" || currentTab === "Drive Management") {
        return (
            <div className='glass p-8'>
                <div className='flex justify-between items-center mb-10'>
                    <h3 className='text-2xl font-black italic uppercase'>Active Neural Drives</h3>
                    <button onClick={addDrive} className='bg-indigo-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest'>Announce New Drive</button>
                </div>
                <div className='space-y-4'>
                    {(globalSync.drives || []).map((d, i) => (
                        <div key={i} className='flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10'>
                            <div className='flex items-center gap-6'>
                                <div className='w-3 h-3 rounded-full bg-emerald-500 pulse'></div>
                                <div><h4 className='font-bold'>{d.title}</h4><p className='text-xs text-slate-500'>{d.desc}</p></div>
                            </div>
                            <div className='flex gap-2'>
                                <button onClick={() => deleteDrive(i)} className='px-4 py-2 bg-rose-500/20 text-rose-400 rounded-xl text-[10px] font-black uppercase'>Deactivate</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- DATA HELPERS ---
    const getStudents = () => {
        const cloud = JSON.parse(localStorage.getItem('ih_cloud')) || {};
        return Object.values(cloud).filter(u => u.role === 'student');
    };

    // --- TABS IMPLEMENTATION ---

    if (currentTab === "Broadcasting") {
        return (
            <div className='glass p-8 space-y-8'>
                <div className='flex justify-between items-center mb-10'>
                    <h3 className='text-2xl font-black italic uppercase'>Broadcast Center</h3>
                    <button onClick={sendBroadcast} className='bg-rose-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20'>Initiate Global Signal</button>
                </div>
                <div className='space-y-4'>
                    {(globalSync.broadcasts || []).map((b, i) => (
                        <div key={i} className='p-6 bg-white/5 rounded-3xl border border-white/10'>
                            <h4 className='font-bold uppercase text-xs mb-1'>{b.sender}</h4>
                            <p className='text-lg font-medium text-slate-300'>"{b.text}"</p>
                            <p className='text-[10px] text-slate-500 mt-4 uppercase tracking-widest'>{b.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (currentTab === "Staff Monitoring") {
        // Mock activity logic
        const staff = [
            { name: "Institutional AI", role: "AI", activity: getStudents().filter(s => s.resume?.status === "Verified").length },
            { name: "Prof. Trupthi", role: "FA", activity: 12 },
            { name: "Dr. K. Rao", role: "HOD", activity: 5 }
        ].sort((a, b) => b.activity - a.activity);

        return (
            <div className='glass p-8'>
                <h3 className='text-2xl font-black italic uppercase mb-10'>Institutional Productivity Log</h3>
                <table className='w-full text-left'>
                    <thead>
                        <tr className='border-b border-white/10 text-[10px] uppercase tracking-widest text-slate-500'>
                            <th className='pb-4 px-4'>Staff Identity</th>
                            <th className='pb-4 px-4'>Tier</th>
                            <th className='pb-4 px-4 text-right'>Verification Log</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((s, i) => (
                            <tr key={i} className='border-b border-white/5'>
                                <td className='py-4 px-4 font-bold'>{s.name}</td>
                                <td className='py-4 px-4'><span className='text-[9px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-black uppercase'>{s.role}</span></td>
                                <td className='py-4 px-4 text-right font-black text-emerald-400'>{s.activity} AUDITS</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (currentTab === "Verification Cell" || currentTab === "Resume Audit" || currentTab === "Skill Intelligence") {
        const students = getStudents();
        return (
            <div className='glass p-8'>
                <h3 className='text-2xl font-black italic uppercase mb-10'>Institutional Talent Matrix</h3>
                <table className='w-full text-left'>
                    <thead>
                        <tr className='border-b border-white/10 text-[10px] uppercase tracking-widest text-slate-500'>
                            <th className='pb-4 px-4'>Student Identity</th>
                            <th className='pb-4 px-4'>Dept</th>
                            <th className='pb-4 px-4'>AI Score</th>
                            <th className='pb-4 px-4 text-right'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s, i) => (
                            <tr key={i} className='border-b border-white/5 hover:bg-white/5 transition-all'>
                                <td className='py-6 px-4 font-bold'>{s.name}</td>
                                <td className='py-6 px-4 text-[10px] uppercase'>{s.dept || "CSE"}</td>
                                <td className='py-6 px-4 font-black'>{s.resume?.score || "--"}</td>
                                <td className='py-6 px-4 text-right'>
                                    <button className='bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all'>View Synapse</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (currentTab === "Dept Analytics") {
        const students = getStudents();
        const avg = students.length ? (students.reduce((a, s) => a + (parseFloat(s.resume?.score) || 0), 0) / students.length).toFixed(1) : 0;

        return (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2'>
                <div className='glass p-10 bg-indigo-500/5 relative overflow-hidden'>
                    <div className='absolute top-0 right-0 p-8 opacity-10 font-black text-8xl'>{avg}%</div>
                    <h3 className='text-2xl font-black mb-10 italic uppercase'>Institutional Readiness</h3>
                    <div className='h-4 w-full bg-white/5 rounded-full overflow-hidden'>
                        <div className='h-full gradient-bg transition-all duration-1000' style={{ width: `${avg}%` }}></div>
                    </div>
                </div>
                <div className='glass p-10 bg-rose-500/5'>
                    <h3 className='text-xl font-black italic uppercase mb-6'>Directives</h3>
                    <div className='flex gap-4'>
                        <input id='directive-input' type='text' placeholder='Enter global directive...' className='flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium outline-none' />
                        <button onClick={sendBroadcast} className='bg-rose-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest'>Transmit</button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentTab === "Reporting Engine" || currentTab === "Global Metrics") {
        const students = getStudents();
        const skillDensity = [
            { name: "JAVA", percent: 85 },
            { name: "PYTHON", percent: 72 },
            { name: "REACT", percent: 64 },
            { name: "AWS", percent: 45 },
            { name: "SYSTEM DESIGN", percent: 30 }
        ]; // Mocked as calculation is complex in React without full DB, but provides the UI

        return (
            <>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                    <div className='glass p-8 bg-indigo-500/5'><h4 className='text-4xl font-black text-indigo-400'>{students.length}</h4><p className='text-[10px] font-black uppercase tracking-widest mt-2'>Total Talent Links</p></div>
                    <div className='glass p-8 bg-emerald-500/5'><h4 className='text-4xl font-black text-emerald-400'>{students.filter(s => s.resume).length}</h4><p className='text-[10px] font-black uppercase tracking-widest mt-2'>Resumes Optimized</p></div>
                    <div className='glass p-8 bg-rose-500/5'><h4 className='text-4xl font-black text-rose-400'>18.2</h4><p className='text-[10px] font-black uppercase tracking-widest mt-2'>Avg Neural Package (LPA)</p></div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div className='glass p-10'>
                        <h3 className='text-xl font-black italic uppercase mb-6 text-white'>Neural Placement Trends (2025)</h3>
                        <div className='h-60 w-full bg-white/5 rounded-3xl flex items-end justify-between p-8 gap-4'>
                            <div className='w-full bg-indigo-500/20 h-[40%] rounded-t-lg relative group'><div className='absolute -top-6 left-0 right-0 text-center text-[10px] opacity-0 group-hover:opacity-100 transition-all font-black uppercase'>JAN</div></div>
                            <div className='w-full bg-indigo-500/40 h-[60%] rounded-t-lg relative group'><div className='absolute -top-6 left-0 right-0 text-center text-[10px] opacity-0 group-hover:opacity-100 transition-all font-black uppercase'>FEB</div></div>
                            <div className='w-full bg-emerald-500 h-[90%] rounded-t-lg relative group'><div className='absolute -top-6 left-0 right-0 text-center text-[10px] opacity-0 group-hover:opacity-100 transition-all font-black uppercase'>MAR (PEAK)</div></div>
                        </div>
                    </div>
                    <div className='glass p-10'>
                        <h3 className='text-xl font-black italic uppercase mb-6 text-white'>Top Skill Density in Class</h3>
                        <div className='space-y-6'>
                            {skillDensity.map((s, i) => (
                                <div key={i} className='space-y-2'>
                                    <div className='flex justify-between text-[10px] font-black uppercase tracking-widest'>
                                        <span>{s.name}</span>
                                        <span className='text-indigo-400'>{s.percent}%</span>
                                    </div>
                                    <div className='h-2 w-full bg-white/5 rounded-full overflow-hidden'>
                                        <div className='h-full gradient-bg' style={{ width: `${s.percent}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (currentTab === "System Config") {
        return (
            <div className='glass p-10 bg-indigo-900/10 flex flex-col items-center justify-center space-y-6 text-center'>
                <div className='w-20 h-20 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin'></div>
                <h3 className='text-2xl font-black italic uppercase'>Neural Architecture Locked</h3>
                <p className='text-sm text-slate-500 max-w-md'>This interface requires **Super-Admin Authentication**.</p>
            </div>
        );
    }

    return <div className='p-20 text-center text-4xl font-black italic opacity-10 uppercase tracking-tighter'>{currentTab} Portal Component Syncing...</div>;
};

export default HubContent;
