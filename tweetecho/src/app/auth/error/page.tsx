"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">{error || "An error occurred"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
