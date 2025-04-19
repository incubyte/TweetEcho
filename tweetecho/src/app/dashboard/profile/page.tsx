"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {session?.user?.image && (
            <div className="flex justify-center mb-4">
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          )}
          <div className="grid gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-lg">{session?.user?.name || "Not available"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-lg">{session?.user?.email || "Not available"}</p>
            </div>
            <div className="pt-4">
              <Link href="/auth/signout">
                <Button variant="destructive" className="w-full">Sign Out</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}