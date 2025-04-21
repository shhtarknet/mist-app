import { Key, Shield } from 'lucide-react';
import { useCore } from '../lib/useCore';

interface HeaderProps {
  title?: string;
  tagline?: string;
  clean?: boolean;
}

// Component for Header Section
export const Header = ({ title, tagline, clean }: HeaderProps) => {
  const { keyPair, setShowCreateKeyModal } = useCore();

  return (
    <div className="p-6 pb-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {!clean && <div className="mr-3 bg-blue-100 p-2 rounded-lg">
            <Shield size={22} className="text-blue-600" />
          </div>}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title || 'Mist'}</h1>
            <p className="text-xs text-gray-500 mt-1">{tagline || 'Simplified Confidential Transactions'}</p>
          </div>
        </div>

        {keyPair.pubX.toString() && !clean && (
          <button
            onClick={() => setShowCreateKeyModal(true)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            title="Create new key pair"
          >
            <Key size={14} className="mr-1" />
            My Keys
          </button>
        )}
      </div>
    </div>
  );
};
