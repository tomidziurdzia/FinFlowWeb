import { TransactionsTable } from "@/components/transactions/transactions-table";
import { AddTransactionModal } from "@/components/transactions/add-transaction-modal";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">
            Manage all your incomes and expenses in one place
          </p>
        </div>
        <AddTransactionModal />
      </div>
      <TransactionsTable />
    </div>
  );
}
