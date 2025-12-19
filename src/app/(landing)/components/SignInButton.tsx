"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SignInButton() {
  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/home" })}
      variant="outline"
      size="lg"
      className="bg-white text-gray-700 border border-border px-8 py-4 text-lg font-medium rounded flex items-center gap-3 hover:bg-white hover:text-gray-700 hover:border-border"
    >
      <Image
        src="/GoogleIcon.png"
        alt="Google"
        width={24}
        height={24}
      />
      Start Learning
    </Button>
  );
}
