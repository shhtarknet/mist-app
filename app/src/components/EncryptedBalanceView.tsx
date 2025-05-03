import { useCore } from "../lib/useCore";

export const EncryptedBalanceView = () => {
  const { balanceEnc } = useCore();

  return (
    <div className="bg-gray-100 rounded-lg p-3 max-w-full overflow-hidden border border-gray-200 mt-auto">
      <div className="mb-2">
        <pre className="text-xs text-left font-mono text-gray-700 overflow-auto">
          {balanceEnc.c1.x},<br />
          {balanceEnc.c1.y} <br />
          <br />
          {balanceEnc.c2.x},<br />
          {balanceEnc.c2.y}<br />
        </pre>
      </div>
    </div>
  );
};

