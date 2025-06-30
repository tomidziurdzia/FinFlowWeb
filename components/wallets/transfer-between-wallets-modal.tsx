"use client";

import { useState, useMemo } from "react";
import { useWallets } from "@/hooks/use-wallets";
import { useTransfer } from "@/hooks/use-transfer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Repeat } from "lucide-react";

interface TransferBetweenWalletsModalProps {
  trigger?: React.ReactNode;
}

export function TransferBetweenWalletsModal({
  trigger,
}: TransferBetweenWalletsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fromWalletId: "",
    toWalletId: "",
    amount: 0,
    receivedAmount: "",
    description: "",
    notes: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const { data: wallets } = useWallets();
  const transfer = useTransfer();

  const fromWallet = useMemo(
    () => wallets?.find((w) => w.id === formData.fromWalletId),
    [wallets, formData.fromWalletId]
  );
  const toWallet = useMemo(
    () => wallets?.find((w) => w.id === formData.toWalletId),
    [wallets, formData.toWalletId]
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setFormData({
        fromWalletId: "",
        toWalletId: "",
        amount: 0,
        receivedAmount: "",
        description: "",
        notes: "",
      });
      setFormError(null);
    }
  };

  const validate = () => {
    if (!formData.fromWalletId || !formData.toWalletId)
      return "Both wallets are required.";
    if (formData.fromWalletId === formData.toWalletId)
      return "Cannot transfer to the same wallet.";
    if (!formData.amount || formData.amount <= 0)
      return "Amount must be greater than zero.";
    if (!fromWallet) return "Select a source wallet.";
    if (fromWallet.balance < formData.amount)
      return `Insufficient balance in source wallet. Available: ${fromWallet.balance}`;
    if (fromWallet.currency !== toWallet?.currency) {
      if (!formData.receivedAmount || Number(formData.receivedAmount) <= 0)
        return "Received amount is required and must be greater than zero for different currencies.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    try {
      await transfer.mutateAsync({
        fromWalletId: formData.fromWalletId,
        toWalletId: formData.toWalletId,
        amount: Number(formData.amount),
        receivedAmount:
          fromWallet?.currency !== toWallet?.currency
            ? Number(formData.receivedAmount)
            : undefined,
        description: formData.description,
        notes: formData.notes,
      });
      setIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unknown error occurred");
      }
    }
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Repeat className="h-4 w-4 mr-2" />
      Transfer
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transfer Between Wallets</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Wallet
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.fromWalletId}
              onChange={(e) =>
                setFormData({ ...formData, fromWalletId: e.target.value })
              }
              required
            >
              <option value="">Select wallet</option>
              {wallets?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.currency}) - Balance: {w.balance}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Wallet
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.toWalletId}
              onChange={(e) =>
                setFormData({ ...formData, toWalletId: e.target.value })
              }
              required
            >
              <option value="">Select wallet</option>
              {wallets?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.currency}) - Balance: {w.balance}
                </option>
              ))}
            </select>
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
          {fromWallet &&
            toWallet &&
            fromWallet.currency !== toWallet.currency && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received Amount
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.receivedAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, receivedAmount: e.target.value })
                  }
                  required
                />
              </div>
            )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <Input
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Optional"
            />
          </div>
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex justify-end">
            <Button type="submit" disabled={transfer.isPending}>
              {transfer.isPending ? "Transferring..." : "Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
