"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  return <>{children}</>;
}
