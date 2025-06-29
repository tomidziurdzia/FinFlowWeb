"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001";

export function useApiCall() {
  const { getToken } = useAuth();

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = await getToken({
        template: "long_lived_api",
      });

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      return response.json();
    },
    [getToken]
  );

  return { apiCall };
}
