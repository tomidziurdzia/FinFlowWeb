import { auth, currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/sync-user";

export default async function HomePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (userId && user) {
    await syncUser(user);
  }

  return <div>Home</div>;
}
