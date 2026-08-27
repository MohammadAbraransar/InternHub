import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';

const AuthHandler = ({ onLogin }) => {
    const { DB_ROLES, setActiveUser, setActiveEmail, cloudActive, ih_push } = useGlobal();
    const [view, setView] = useState('login'); // login, signup, forgot, otp, reset
    const [width, setWidth] = useState(0); // Progress bar logic if needed? No, purely view switch.

    // Form States
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');

    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');

    const [forgotEmail, setForgotEmail] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [currentOtp, setCurrentOtp] = useState('');
    const [newPass, setNewPass] = useState('');

    const [rolePreview, setRolePreview] = useState({ name: 'Analyzing...', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' });
    const [showRolePreview, setShowRolePreview] = useState(false);

    const checkRole = (email) => {
        if (!email) {
            setShowRolePreview(false);
            return;
        }
        setShowRolePreview(true);
        const lower = email.toLowerCase();

        let roleName = "Faculty Oversight";
        let colorClass = "text-indigo-400";
        let bgClass = "bg-indigo-500/10";
        let borderClass = "border-indigo-500/20";

        if (/^\d/.test(lower)) {
            roleName = "Student Excellence";
            colorClass = "text-emerald-400";
            bgClass = "bg-emerald-500/10";
            borderClass = "border-emerald-500/20";
        } else if (lower.startsWith("hod.")) {
            roleName = "Institutional Authority (HOD)";
            colorClass = "text-amber-400";
            bgClass = "bg-amber-500/10";
            borderClass = "border-amber-500/20";
        } else if (lower.startsWith("admin.")) {
            roleName = "System Administrator";
            colorClass = "text-rose-400";
            bgClass = "bg-rose-500/10";
            borderClass = "border-rose-500/20";
        } else if (lower.startsWith("pc.")) {
            roleName = "Placement Intelligence (PC)";
            colorClass = "text-cyan-400";
            bgClass = "bg-cyan-500/10";
            borderClass = "border-cyan-500/20";
        }

        setRolePreview({ name: roleName, color: colorClass, bg: bgClass, border: borderClass });
    };

    const handleLogin = () => {
        const cloud = JSON.parse(localStorage.getItem('ih_cloud')) || {};
        const email = loginEmail.toLowerCase().trim();
        const u = cloud[email] || cloud[email.replace(/\./g, '_')];

        if (u && u.pass === loginPass) {
            const roleKey = u.role === 'coordinator' ? 'coordinator' : u.role; // map if needed
            const roleObj = DB_ROLES[roleKey];
            setActiveUser(roleObj);
            setActiveEmail(email);
            onLogin(u.name);
        } else {
            alert("Access Denied: Check Credentials");
        }
    };

    const handleSignup = async () => {
        const email = regEmail.toLowerCase().trim();
        if (!email.endsWith("@anurag.edu.in") || regPass.length < 3) {
            alert("Invalid Institutional Mail or weak password");
            return;
        }
        const cloud = JSON.parse(localStorage.getItem('ih_cloud')) || {};
        if (cloud[email]) {
            alert("Existing Link Found");
            return;
        }

        let role = "faculty";
        if (/^\d/.test(email)) role = "student";
        else if (email.startsWith("hod.")) role = "hod";
        else if (email.startsWith("admin.")) role = "admin";
        else if (email.startsWith("pc.")) role = "coordinator";

        const newUser = { name: regName, pass: regPass, role };
        cloud[email] = newUser;
        localStorage.setItem('ih_cloud', JSON.stringify(cloud));

        if (cloudActive) {
            await ih_push(`ih_cloud/${email.replace(/\./g, '_')}`, newUser);
        }

        alert(`Neural Link Established: ${role.toUpperCase()}`);
        setView('login');
    };

    const sendOTP = () => {
        const generated = Math.floor(100000 + Math.random() * 900000).toString();
        setCurrentOtp(generated);
        alert(`[RECOVERY] Synchronizing OTP: ${generated}`); // Simulate email
        setView('otp');
    };

    const verifyOTP = () => {
        if (otpInput === currentOtp) setView('reset');
        else alert("Sync Error");
    };

    const finalizeReset = async () => {
        const cloud = JSON.parse(localStorage.getItem('ih_cloud')) || {};
        const email = forgotEmail.toLowerCase().trim(); // Assume stored from forgot step, simpler here to just use input? 
        // Logic gap in original code: 'activeEmail' used but not set during forgot. 
        // We need to track the email being recovered.
        // Assuming user typed email in forgot screen.
        if (cloud[forgotEmail]) {
            cloud[forgotEmail].pass = newPass;
            localStorage.setItem('ih_cloud', JSON.stringify(cloud));
            alert("Synapse Reset Complete. Logging in...");
            setView('login');
        } else {
            alert("Email not found");
        }
    };

    return (
        <div id="auth-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} className="bg-[radial-gradient(ellipse_at_top_right,#1e1b4b,#020617)] overflow-hidden">
            <div className="relative w-full max-w-md p-6 animate-in fade-in zoom-in duration-500">

                {/* Decorative Elements */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="glass-strong p-10 relative z-10 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 gradient-bg rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-lg italic transform rotate-3 hover:rotate-6 transition-all">iH</div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2 text-white uppercase">Intern<span className="gradient-text">Hub</span></h1>
                        <p className="text-slate-400 font-bold tracking-[0.3em] text-[10px] uppercase">Elite Neural Intelligence</p>
                    </div>

                    {/* Tabs */}
                    {(view === 'login' || view === 'signup') && (
                        <div className="flex gap-2 p-1.5 bg-black/20 rounded-2xl mb-8 border border-white/5">
                            <button onClick={() => setView('login')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'login' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Sign In</button>
                            <button onClick={() => setView('signup')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'signup' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Sign Up</button>
                        </div>
                    )}

                    {view === 'login' && (
                        <div className="space-y-5">
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => { setLoginEmail(e.target.value); checkRole(e.target.value); }}
                                placeholder="Email (@anurag.edu.in)"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500 focus:bg-slate-900/80 transition-all text-sm"
                            />
                            <div className={`${showRolePreview ? 'flex' : 'hidden'} px-4 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest items-center gap-3 transition-all duration-500 ${rolePreview.bg} ${rolePreview.border}`}>
                                <div className={`w-2 h-2 rounded-full pulse ${rolePreview.color.replace('text', 'bg')}`}></div>
                                Neural Path: <span className={rolePreview.color}>{rolePreview.name}</span>
                            </div>

                            <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Password" className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500 focus:bg-slate-900/80 transition-all text-sm" />
                            <button onClick={handleLogin} className="w-full gradient-bg py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all mt-4">ESTABLISH CONNECTION</button>
                            <button onClick={() => setView('forgot')} className="text-[10px] text-indigo-400 font-bold uppercase block text-center hover:text-indigo-300 transition-colors">Forgot Credentials?</button>
                        </div>
                    )}

                    {view === 'signup' && (
                        <div className="space-y-5">
                            <input value={regName} onChange={(e) => setRegName(e.target.value)} type="text" placeholder="Full Name" className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-emerald-500 focus:bg-slate-900/80 transition-all text-sm" />
                            <input
                                value={regEmail}
                                onChange={(e) => { setRegEmail(e.target.value); checkRole(e.target.value); }}
                                type="email"
                                placeholder="Email (@anurag.edu.in)"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-emerald-500 focus:bg-slate-900/80 transition-all text-sm"
                            />
                            <div className={`${showRolePreview ? 'flex' : 'hidden'} px-4 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest items-center gap-3 transition-all duration-500 ${rolePreview.bg} ${rolePreview.border}`}>
                                <div className={`w-2 h-2 rounded-full pulse ${rolePreview.color.replace('text', 'bg')}`}></div>
                                Identity Sync: <span className={rolePreview.color}>{rolePreview.name}</span>
                            </div>
                            <input value={regPass} onChange={(e) => setRegPass(e.target.value)} type="password" placeholder="Set Password" className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-emerald-500 focus:bg-slate-900/80 transition-all text-sm" />
                            <button onClick={handleSignup} className="w-full gradient-bg py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl hover:shadow-2xl transition-all mt-4">INITIALIZE ACCOUNT</button>
                        </div>
                    )}

                    {view === 'forgot' && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-black text-white italic text-center">Cloud Recovery</h3>
                            <input value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} type="email" placeholder="Institutional Email" className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500" />
                            <button onClick={sendOTP} className="w-full bg-indigo-600 py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500">SEND CODE</button>
                            <button onClick={() => setView('login')} className="text-[10px] text-slate-500 uppercase block text-center hover:text-white transition-colors">Back</button>
                        </div>
                    )}

                    {view === 'otp' && ( // Added missing OTP and Reset views from previous code if they were there, or just keep as is if they were fully replaced. Wait, I should assume I am replacing safely.
                        <div className="space-y-6">
                            <input value={otpInput} onChange={(e) => setOtpInput(e.target.value)} type="text" maxLength="6" className="w-full bg-slate-900/50 border-2 border-indigo-500 text-center py-4 text-2xl font-black text-white rounded-2xl tracking-[1em]" />
                            <button onClick={verifyOTP} className="w-full gradient-bg py-4 rounded-2xl font-black text-white text-[10px] uppercase tracking-widest">VERIFY</button>
                        </div>
                    )}

                    {view === 'reset' && (
                        <div className="space-y-6">
                            <input value={newPass} onChange={(e) => setNewPass(e.target.value)} type="password" placeholder="New Password" className="w-full bg-slate-900/50 border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none" />
                            <button onClick={finalizeReset} className="w-full gradient-bg py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest">RESET</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthHandler;
