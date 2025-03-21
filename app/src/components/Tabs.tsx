import React from 'react';
import { clsx } from 'clsx';

interface TabsProps {
  activeTab: 'onboard' | 'transfer';
  onTabChange: (tab: 'onboard' | 'transfer') => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Tabs">
        {['onboard', 'transfer'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab as 'onboard' | 'transfer')}
            className={clsx(
              'py-4 px-1 border-b-2 font-medium text-sm capitalize',
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}