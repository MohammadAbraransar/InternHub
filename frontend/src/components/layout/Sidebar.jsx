import React from 'react';
import { useGlobal } from '../../context/GlobalContext';

const Sidebar = ({ currentTab, onNavigate }) => {
    const { activeUser } = useGlobal();

    return (
        <aside className="w-80 glass p-10 flex flex-col shrink-0 bg-white/[0.01]">
            <div className="mb-14 flex items-center gap-4">
                <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center font-black text-2xl text-white italic shadow-lg">iH</div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase text-white leading-none">InternHub</h2>
                    <p className="text-[9px] font-black text-indigo-400 tracking-widest mt-1 uppercase">Institutional Hub</p>
                </div>
            </div>

            <nav className="flex-1 space-y-3 overflow-y-auto custom-scroll">
                {activeUser.tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onNavigate(tab)}
                        className={`nav-item w-full px-6 py-4 rounded-3xl text-left font-bold mb-2 transition-all ${currentTab === tab ? 'sidebar-active text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl">
                    <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center font-black text-2xl text-white">U</div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-black text-white truncate">{activeUser.name}</p>
                        <p className="text-[9px] font-black text-slate-600 uppercase">{activeUser.id}</p>
                    </div>
                </div>
                <button onClick={() => window.location.reload()} className="w-full py-5 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Logout</button>
            </div>
        </aside>
    );
};

export default Sidebar;
