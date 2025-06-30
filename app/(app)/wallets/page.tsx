import { WalletsTable } from "@/components/wallets/wallets-table";
import { AddWalletModal } from "@/components/wallets/add-wallet-modal";

export default function WalletsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallets</h1>
          <p className="text-gray-600 mt-2">
            Organize your finances by wallets
          </p>
        </div>
        <AddWalletModal />
      </div>
      <WalletsTable />
    </div>
  );
}
