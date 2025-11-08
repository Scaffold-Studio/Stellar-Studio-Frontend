"use client";

import { useStellarWallet } from "@/hooks/useStellarWallet";
import { useClientMounted } from "@/hooks/useClientMount";

export const InfoList = () => {
  const { publicKey, isConnected, isConnecting, network } = useStellarWallet();
  const mounted = useClientMounted();

  return !mounted ? null : (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md">
      <section>
        <h2 className="mb-4 text-gray-800">Account Information</h2>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Address: {publicKey || 'Not connected'}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Connected: {isConnected.toString()}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Network: {network}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Loading: {isConnecting.toString()}
        </div>
      </section>
    </div>
  );
};
