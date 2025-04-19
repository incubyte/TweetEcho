"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p><span className="font-medium">Username:</span> {session?.user?.name}</p>
              <Link href="/dashboard/profile">
                <Button>View Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Tweet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Ready to share something with the world?</p>
            <Link href="/dashboard/tweet">
              <Button>Create Tweet</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
