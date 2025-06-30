import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

interface TransferRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  receivedAmount?: number;
  description: string;
  notes?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001";

export function useTransfer() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (transfer: TransferRequest) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/transfers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transfer),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to transfer between wallets");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Transfer completed successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to transfer between wallets");
    },
  });
}
