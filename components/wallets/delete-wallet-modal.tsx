"use client";

import { useDeleteWallet } from "@/hooks/use-wallets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";

interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  description?: string;
}

interface DeleteWalletModalProps {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteWalletModal({
  wallet,
  isOpen,
  onClose,
}: DeleteWalletModalProps) {
  const deleteWallet = useDeleteWallet();

  const handleDelete = async () => {
    if (!wallet) return;
    try {
      await deleteWallet.mutateAsync(wallet.id);
      onClose();
    } catch (error) {
      console.error("Error deleting wallet:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Wallet
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the wallet &ldquo;{wallet?.name}
            &rdquo;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteWallet.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteWallet.isPending}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleteWallet.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
