import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export const TRANSACTION_TYPE_MAPPING = {
  Expense: 0,
  Income: 1,
  Investment: 2,
} as const;

export const REVERSE_TRANSACTION_TYPE_MAPPING = {
  0: "Expense",
  1: "Income",
  2: "Investment",
} as const;

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001";

const queryKeys = {
  transactions: ["transactions"] as const,
  transaction: (id: string) => ["transactions", id] as const,
} as const;

export function useTransactions() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: async (): Promise<Transaction[]> => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      return data.map((transaction: Record<string, unknown>) => ({
        ...transaction,
        type:
          REVERSE_TRANSACTION_TYPE_MAPPING[
            transaction.type as keyof typeof REVERSE_TRANSACTION_TYPE_MAPPING
          ] || "Expense",
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, "id">) => {
      const token = await getToken();
      const requestBody = {
        description: transaction.description,
        amount: transaction.amount,
        type: TRANSACTION_TYPE_MAPPING[transaction.type],
        date: transaction.date,
        notes: transaction.notes,
        categoryId: transaction.categoryId,
        walletId: transaction.walletId,
      };
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error("Failed to create transaction");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      toast.success(
        `Transaction "${variables.description}" created successfully!`
      );
    },
    onError: (error: Error, variables) => {
      toast.error(
        `Failed to create transaction "${variables?.description}": ${error.message}`
      );
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      const token = await getToken();
      const requestBody = {
        description: transaction.description,
        amount: transaction.amount,
        type: TRANSACTION_TYPE_MAPPING[transaction.type],
        date: transaction.date,
        notes: transaction.notes,
        categoryId: transaction.categoryId,
        walletId: transaction.walletId,
      };
      const response = await fetch(
        `${API_BASE_URL}/transactions/${transaction.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) throw new Error("Failed to update transaction");
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      return transaction;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      toast.success(
        `Transaction "${variables.description}" updated successfully!`
      );
    },
    onError: (error: Error, variables) => {
      toast.error(
        `Failed to update transaction "${variables?.description}": ${error.message}`
      );
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      return { id };
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        queryKeys.transactions,
        (oldData: Transaction[] | undefined) =>
          oldData?.filter((transaction) => transaction.id !== id)
      );
      toast.success("Transaction deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete transaction: ${error.message}`);
    },
  });
}
