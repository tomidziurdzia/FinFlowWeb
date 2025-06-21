import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
        <p className="text-gray-600 mt-2">
          Únete a ExpenseFlow y controla tus gastos
        </p>
      </div>
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm",
            card: "shadow-none",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
        redirectUrl="/"
      />
    </div>
  );
}
