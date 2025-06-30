"use client";

import { useState, useEffect } from "react";
import {
  useCreateTransaction,
  useUpdateTransaction,
  TRANSACTION_TYPE_MAPPING,
} from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { useWallets } from "@/hooks/use-wallets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: keyof typeof TRANSACTION_TYPE_MAPPING;
  date: string;
  notes?: string;
  categoryId: string;
  walletId: string;
}

interface AddTransactionModalProps {
  transaction?: Transaction;
  trigger?: React.ReactNode;
}

export function AddTransactionModal({
  transaction,
  trigger,
}: AddTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: 0,
    type: "Expense" as keyof typeof TRANSACTION_TYPE_MAPPING,
    date: new Date().toISOString(),
    notes: "",
    categoryId: "",
    walletId: "",
  });

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const { data: categories } = useCategories();
  const { data: wallets } = useWallets();

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: new Date(transaction.date).toISOString(),
        notes: transaction.notes || "",
        categoryId: String(transaction.categoryId ?? ""),
        walletId: String(transaction.walletId ?? ""),
      });
      console.log(
        "[EDIT] categoryId:",
        transaction.categoryId,
        "walletId:",
        transaction.walletId
      );
    } else {
      setFormData({
        description: "",
        amount: 0,
        type: "Expense",
        date: new Date().toISOString(),
        notes: "",
        categoryId: "",
        walletId: "",
      });
    }
  }, [transaction]);

  useEffect(() => {
    if (categories) {
      console.log(
        "[CATEGORIES]",
        categories.map((c) => ({ id: c.id, name: c.name }))
      );
    }
    if (wallets) {
      console.log(
        "[WALLETS]",
        wallets.map((w) => ({ id: w.id, name: w.name }))
      );
    }
    console.log("[FORMDATA]", formData);
  }, [categories, wallets, formData]);

  const resetForm = () => {
    setFormData({
      description: "",
      amount: 0,
      type: "Expense",
      date: new Date().toISOString(),
      notes: "",
      categoryId: "",
      walletId: "",
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.description.trim() ||
      !formData.categoryId ||
      !formData.walletId
    ) {
      return;
    }
    try {
      if (isEditing && transaction) {
        await updateTransaction.mutateAsync({
          id: transaction.id,
          ...formData,
        });
      } else {
        await createTransaction.mutateAsync(formData);
      }
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const defaultTrigger = isEditing ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      New Transaction
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Transaction" : "New Transaction"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input
                placeholder="e.g. Grocery shopping, Salary"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <Input
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target
                      .value as keyof typeof TRANSACTION_TYPE_MAPPING,
                  })
                }
              >
                {Object.keys(TRANSACTION_TYPE_MAPPING).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={formData.date.slice(0, 10)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: new Date(e.target.value).toISOString(),
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: String(e.target.value),
                  })
                }
                required
              >
                <option value="">Select a category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.walletId}
                onChange={(e) =>
                  setFormData({ ...formData, walletId: String(e.target.value) })
                }
                required
              >
                <option value="">Select a wallet</option>
                {wallets?.map((wal) => (
                  <option key={wal.id} value={wal.id}>
                    {wal.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <Input
                placeholder="Optional"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  createTransaction.isPending || updateTransaction.isPending
                }
              >
                {isEditing
                  ? updateTransaction.isPending
                    ? "Saving..."
                    : "Save Changes"
                  : createTransaction.isPending
                  ? "Creating..."
                  : "Create Transaction"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
