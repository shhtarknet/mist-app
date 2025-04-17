import { Shield } from 'lucide-react';
// Component for Header Section
export const Header = () => {
  return (
    <div className="p-6 pb-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="mr-3 bg-blue-100 p-2 rounded-lg">
          <Shield size={22} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">CipherMist</h1>
          <p className="text-xs text-gray-500 mt-1">Encrypted ElGamal Transfer Protocol</p>
        </div>
      </div>
    </div>
  );
};
