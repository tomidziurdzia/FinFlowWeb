"use client";

import { useState, useEffect } from "react";
import {
  useCreateWallet,
  useUpdateWallet,
  WALLET_TYPE_MAPPING,
  CURRENCY_TYPE_MAPPING,
} from "@/hooks/use-wallets";
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

interface Wallet {
  id: string;
  name: string;
  type: keyof typeof WALLET_TYPE_MAPPING;
  balance: number;
  currency: keyof typeof CURRENCY_TYPE_MAPPING;
  description?: string;
}

interface AddWalletModalProps {
  wallet?: Wallet;
  trigger?: React.ReactNode;
}

export function AddWalletModal({ wallet, trigger }: AddWalletModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "Cash" as keyof typeof WALLET_TYPE_MAPPING,
    balance: 0,
    currency: "USD" as keyof typeof CURRENCY_TYPE_MAPPING,
    description: "",
  });

  const createWallet = useCreateWallet();
  const updateWallet = useUpdateWallet();

  const isEditing = !!wallet;

  useEffect(() => {
    if (wallet) {
      setFormData({
        name: wallet.name,
        type: wallet.type,
        balance: wallet.balance,
        currency: wallet.currency,
        description: wallet.description || "",
      });
    } else {
      setFormData({
        name: "",
        type: "Cash",
        balance: 0,
        currency: "USD",
        description: "",
      });
    }
  }, [wallet]);

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Cash",
      balance: 0,
      currency: "USD",
      description: "",
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
    if (!formData.name.trim()) {
      return;
    }
    try {
      if (isEditing && wallet) {
        await updateWallet.mutateAsync({
          id: wallet.id,
          ...formData,
        });
      } else {
        await createWallet.mutateAsync(formData);
      }
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving wallet:", error);
    }
  };

  const defaultTrigger = isEditing ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      New Wallet
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Wallet" : "New Wallet"}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                placeholder="e.g. Cash, Bank, Investments"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
                    type: e.target.value as keyof typeof WALLET_TYPE_MAPPING,
                  })
                }
              >
                {Object.keys(WALLET_TYPE_MAPPING).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Balance
              </label>
              <Input
                type="number"
                min="0"
                value={formData.balance}
                onChange={(e) =>
                  setFormData({ ...formData, balance: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currency: e.target
                      .value as keyof typeof CURRENCY_TYPE_MAPPING,
                  })
                }
              >
                {Object.keys(CURRENCY_TYPE_MAPPING).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input
                placeholder="Optional"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={createWallet.isPending || updateWallet.isPending}
              >
                {isEditing
                  ? updateWallet.isPending
                    ? "Saving..."
                    : "Save Changes"
                  : createWallet.isPending
                  ? "Creating..."
                  : "Create Wallet"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
