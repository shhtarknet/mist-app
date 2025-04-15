import React, { useState } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import HomeTab from './components/HomeTab';
// import { OnboardTab } from './components/OnboardTab';
import { TransferTab } from './components/TransferTab';
import { Toaster } from 'react-hot-toast';
import { StarknetProvider } from './lib/useStarknet';
import ProofPlayground from './components/NoirPlayground';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'transfer'>('home');
  return (
    <StarknetProvider autoConnect={true}>

      <div className="min-h-screen bg-gray-50">
        <Toaster position="bottom-right" />
        <Header />

        <main className="container mx-auto mt-8">
          <HomeTab />
          <TransferTab />
        </main>
      </div>
    </StarknetProvider>
  );
}

export default App;