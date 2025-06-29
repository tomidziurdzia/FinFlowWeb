import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
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

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }

      // If no JSON content, return a success response
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast.success(`Category "${variables.name}" created successfully!`);
    },
    onError: (error, variables) => {
      toast.error(
        `Failed to create category "${variables.name}": ${error.message}`
      );
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (category: Category) => {
      const token = await getToken();

      const requestBody = {
        name: category.name,
        type: TYPE_MAPPING[category.type],
        color: category.color,
        icon: category.icon,
      };

      const response = await fetch(
        `${API_BASE_URL}/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", response.status, errorText);
        throw new Error(
          `Failed to update category: ${response.status} - ${errorText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }

      return { ...category };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast.success(`Category "${variables.name}" updated successfully!`);
    },
    onError: (error, variables) => {
      toast.error(
        `Failed to update category "${variables.name}": ${error.message}`
      );
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
      return { id };
    },
    onSuccess: (_, id) => {
      // Remove the specific category from cache instead of invalidating all
      queryClient.setQueryData(
        queryKeys.categories,
        (oldData: Category[] | undefined) => {
          if (!oldData) return oldData;
          const deletedCategory = oldData.find((cat) => cat.id === id);
          const filteredData = oldData.filter((category) => category.id !== id);

          // Show toast with category name if we found it
          if (deletedCategory) {
            toast.success(
              `Category "${deletedCategory.name}" deleted successfully!`
            );
          }

          return filteredData;
        }
      );
    },
    onError: (error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
}
