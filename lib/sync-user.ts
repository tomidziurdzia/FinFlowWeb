import type { User } from "@clerk/nextjs/server";
import { apiCall } from "./api";

export async function syncUser(user: User) {
  try {
    const userData = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    await apiCall("/users/sync", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  } catch (error) {
    throw error;
  }
}
