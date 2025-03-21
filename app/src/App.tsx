import React, { useState } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { OnboardTab } from './components/OnboardTab';
import { TransferTab } from './components/TransferTab';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState<'onboard' | 'transfer'>('onboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      
      <main className="container mx-auto mt-8">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {activeTab === 'onboard' ? <OnboardTab /> : <TransferTab />}
        </div>
      </main>
    </div>
  );
}

export default App;