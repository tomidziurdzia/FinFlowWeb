import Image from "next/image";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 lg:p-0">
      <div className="flex w-full max-w-4xl min-h-[500px] h-[500px] overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="hidden md:block md:w-1/2">
          <Image
            src="/logo.png"
            width={675}
            height={900}
            alt="Login image"
            className="h-full w-full object-cover"
          />
        </div>
        <SignIn />
      </div>
    </div>
  );
}
