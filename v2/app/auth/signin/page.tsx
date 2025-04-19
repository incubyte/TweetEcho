"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Login Successful
          </CardTitle>
          <CardDescription className="text-center">
            Click on continue to go to the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => router.replace("/")}>
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
