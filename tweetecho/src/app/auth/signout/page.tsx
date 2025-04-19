"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign Out</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center">Are you sure you want to sign out?</p>
          <Button
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Yes, Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
