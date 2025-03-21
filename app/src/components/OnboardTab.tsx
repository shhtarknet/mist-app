import React from 'react';
import { KeyRound } from 'lucide-react';

export function OnboardTab() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <KeyRound className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Key Generation</h2>
      <p className="text-gray-600 text-center max-w-md">
        Key generation functionality is coming soon. This feature will allow you to generate secure keys
        for private transfers.
      </p>
    </div>
  );
}