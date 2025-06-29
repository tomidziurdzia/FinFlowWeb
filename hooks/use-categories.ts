import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { TYPE_MAPPING, REVERSE_TYPE_MAPPING } from "@/constants/categories";

interface Category {
  id: string;
  name: string;
  type: "expense" | "income" | "investment";
  color: string;
  icon: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001";

const queryKeys = {
  categories: ["categories"] as const,
  category: (id: string) => ["categories", id] as const,
} as const;

export function useCategories() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async (): Promise<Category[]> => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();

      return data.map(
        (category: {
          id: string;
          name: string;
          type: number;
          color: string;
          icon: string;
        }) => ({
          ...category,
          type:
            REVERSE_TYPE_MAPPING[
              category.type as keyof typeof REVERSE_TYPE_MAPPING
            ] || "expense",
        })
      );
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (category: Omit<Category, "id">) => {
      const token = await getToken();

      const requestBody = {
        name: category.name,
        type: TYPE_MAPPING[category.type],
        color: category.color,
        icon: category.icon,
      };

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", response.status, errorText);
        throw new Error(
          `Failed to create category: ${response.status} - ${errorText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.category(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}
