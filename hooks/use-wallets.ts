import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export const WALLET_TYPE_MAPPING = {
  Cash: 0,
  Bank: 1,
  Credit: 2,
  Investment: 3,
  Crypto: 4,
} as const;

export const REVERSE_WALLET_TYPE_MAPPING = {
  0: "Cash",
  1: "Bank",
  2: "Credit",
  3: "Investment",
  4: "Crypto",
} as const;

export const CURRENCY_TYPE_MAPPING = {
  DKK: 0,
  EUR: 1,
  ARS: 2,
  USD: 3,
} as const;

export const REVERSE_CURRENCY_TYPE_MAPPING = {
  0: "DKK",
  1: "EUR",
  2: "ARS",
  3: "USD",
} as const;

interface Wallet {
  id: string;
  name: string;
  type: keyof typeof WALLET_TYPE_MAPPING;
  balance: number;
  currency: keyof typeof CURRENCY_TYPE_MAPPING;
  description?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001";

const queryKeys = {
  wallets: ["wallets"] as const,
  wallet: (id: string) => ["wallets", id] as const,
} as const;

export function useWallets() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.wallets,
    queryFn: async (): Promise<Wallet[]> => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/wallets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error("No se pudieron obtener las billeteras");
      const data = await response.json();
      return data.map((wallet: Record<string, unknown>) => ({
        ...wallet,
        type:
          REVERSE_WALLET_TYPE_MAPPING[
            wallet.type as keyof typeof REVERSE_WALLET_TYPE_MAPPING
          ] || "Cash",
        currency:
          REVERSE_CURRENCY_TYPE_MAPPING[
            wallet.currency as keyof typeof REVERSE_CURRENCY_TYPE_MAPPING
          ] || "USD",
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (wallet: Omit<Wallet, "id">) => {
      const token = await getToken();
      const requestBody = {
        name: wallet.name,
        type: WALLET_TYPE_MAPPING[wallet.type],
        balance: wallet.balance,
        currency: CURRENCY_TYPE_MAPPING[wallet.currency],
        description: wallet.description,
      };
      const response = await fetch(`${API_BASE_URL}/wallets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error("No se pudo crear la billetera");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      toast.success(`¡Billetera "${variables.name}" creada exitosamente!`);
    },
    onError: (error: Error, variables) => {
      toast.error(
        `Error al crear la billetera "${variables?.name}": ${error.message}`
      );
    },
  });
}

export function useUpdateWallet() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (wallet: Wallet) => {
      const token = await getToken();
      const requestBody = {
        name: wallet.name,
        type: WALLET_TYPE_MAPPING[wallet.type],
        balance: wallet.balance,
        currency: CURRENCY_TYPE_MAPPING[wallet.currency],
        description: wallet.description,
      };
      const response = await fetch(`${API_BASE_URL}/wallets/${wallet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error("No se pudo actualizar la billetera");
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      return wallet;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      toast.success(`¡Billetera "${variables.name}" actualizada exitosamente!`);
    },
    onError: (error: Error, variables) => {
      toast.error(
        `Error al actualizar la billetera "${variables?.name}": ${error.message}`
      );
    },
  });
}

export function useDeleteWallet() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/wallets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("No se pudo eliminar la billetera");
      return { id };
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        queryKeys.wallets,
        (oldData: Wallet[] | undefined) =>
          oldData?.filter((wallet) => wallet.id !== id)
      );
      toast.success("¡Billetera eliminada exitosamente!");
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la billetera: ${error.message}`);
    },
  });
}
