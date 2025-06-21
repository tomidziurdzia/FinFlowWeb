import { auth } from "@clerk/nextjs/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001";

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const { getToken } = await auth();
  const token = await getToken();

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
}
