"use client";

import { useDeleteTransaction } from "@/hooks/use-transactions";
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

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  notes?: string;
  categoryId: string;
  walletId: string;
}

interface DeleteTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteTransactionModal({
  transaction,
  isOpen,
  onClose,
}: DeleteTransactionModalProps) {
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async () => {
    if (!transaction) return;
    try {
      await deleteTransaction.mutateAsync(transaction.id);
      onClose();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Transaction
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the transaction &ldquo;
            {transaction?.description}
            &rdquo;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteTransaction.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTransaction.isPending}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleteTransaction.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
