import { auth, currentUser } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/app/sidebar";
import { Header } from "@/components/app/header";
import { syncUser } from "@/lib/sync-user";

export default async function HomePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (userId && user) {
    await syncUser(user);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ¡Bienvenido{user?.firstName ? `, ${user.firstName}` : ""}!
                </h1>
                <p className="text-gray-600 mt-2">
                  Aquí tienes un resumen de tus gastos
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
