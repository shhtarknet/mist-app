import React, { useState } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { OnboardTab } from './components/OnboardTab';
import { TransferTab } from './components/TransferTab';
import { Toaster } from 'react-hot-toast';
import { StarknetProvider } from './hooks/useStarknet';
import ProofPlayground from './components/NoirPlayground';

function App() {
  const [activeTab, setActiveTab] = useState<'onboard' | 'transfer'>('onboard');
  return (
    <StarknetProvider autoConnect={true}>

      <div className="min-h-screen bg-gray-50">
        <Toaster position="bottom-right" />
        <Header />

        <main className="container mx-auto mt-8">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-6">
            {activeTab === 'onboard' ? <OnboardTab /> : <TransferTab />}
            <ProofPlayground />
          </div>
        </main>
      </div>
    </StarknetProvider>
  );
}

export default App;