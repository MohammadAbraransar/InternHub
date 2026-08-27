import React, { useState } from 'react';
import { GlobalProvider, useGlobal } from './context/GlobalContext';
import AuthHandler from './components/auth/AuthHandler';
import Sidebar from './components/layout/Sidebar';
import HubContent from './components/features/HubContent';
import AgentOverlay from './components/features/AgentOverlay';

const InternHubApp = () => {
  const { activeUser, cloudActive } = useGlobal();
  const [currentTab, setCurrentTab] = useState("");

  // Effect to set initial tab when user logs in
  React.useEffect(() => {
    if (activeUser && activeUser.tabs && activeUser.tabs.length > 0) {
      setCurrentTab(activeUser.tabs[0]);
    }
  }, [activeUser]);

  if (!activeUser) {
    return <AuthHandler onLogin={() => { }} />;
  }

  return (
    <div id="main-hub" className="h-screen w-full flex overflow-hidden bg-slate-950">
      <Sidebar currentTab={currentTab} onNavigate={setCurrentTab} />

      <main className="flex-1 flex flex-col gap-6 overflow-hidden">
        <header className="glass h-28 px-12 flex items-center justify-between shrink-0 bg-white/[0.01]">
          <div>
            <h2 className="text-3xl font-black text-white">{currentTab}</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Neural Link Synchronized</p>
          </div>
          <div className="px-6 py-3 glass bg-white/5 border-none flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${cloudActive ? 'bg-emerald-500' : 'bg-slate-500'} pulse`}></div>
            <span className="text-[11px] font-black uppercase text-white">STATUS: {cloudActive ? 'RELIABLE' : 'OFFLINE'}</span>
          </div>
        </header>

        <div id="hub-content" className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scroll">
          <HubContent currentTab={currentTab} navigate={setCurrentTab} />
        </div>
      </main>

      <AgentOverlay navigate={setCurrentTab} />
    </div>
  );
};

const App = () => {
  return (
    <GlobalProvider>
      <InternHubApp />
    </GlobalProvider>
  );
};

export default App;
