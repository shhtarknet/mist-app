import { Copy } from "lucide-react";
import { useCore } from "../lib/useCore";

export const EncryptedBalanceView = () => {
  const { balanceEnc, truncateHash } = useCore();

  return (
    <div className="bg-gray-100 rounded-lg p-3 max-w-full overflow-hidden border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500">C1.x:</span>
        <div className="flex items-center">
          <span className="text-xs font-mono text-gray-700">{truncateHash(balanceEnc.c1.x)}</span>
          <button className="ml-1 text-gray-500 hover:text-blue-600" title="Copy">
            <Copy size={12} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500">C1.y:</span>
        <div className="flex items-center">
          <span className="text-xs font-mono text-gray-700">{truncateHash(balanceEnc.c1.y)}</span>
          <button className="ml-1 text-gray-500 hover:text-blue-600" title="Copy">
            <Copy size={12} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500">C2.x:</span>
        <div className="flex items-center">
          <span className="text-xs font-mono text-gray-700">{truncateHash(balanceEnc.c2.x)}</span>
          <button className="ml-1 text-gray-500 hover:text-blue-600" title="Copy">
            <Copy size={12} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500">C2.y:</span>
        <div className="flex items-center">
          <span className="text-xs font-mono text-gray-700">{truncateHash(balanceEnc.c2.y)}</span>
          <button className="ml-1 text-gray-500 hover:text-blue-600" title="Copy">
            <Copy size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

