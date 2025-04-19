"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const CallbackPage = () => {
  const [message, setMessage] = useState(
    `Hello World, Something is cooking in the Incubyte's AI Hackathon! at ${new Date().toLocaleString()}`
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    // Try to get from localStorage instead
    const codeVerifier = localStorage.getItem("codeVerifier");
    console.log(
      "🚀 ~ useEffect ~ codeVerifier from localStorage:",
      codeVerifier
    );

    axios
      .post("/api/auth/twitter/authorize", { code, codeVerifier })
      .then((res) => {
        console.log("res: ", res);
        setIsLoading(false);
        localStorage.setItem("userId", res.data.id);
        // Optionally clear the codeVerifier now that we've used it
        localStorage.removeItem("codeVerifier");
      });
  }, []);

  const postTweet = async () => {
    const userId = sessionStorage.getItem("userId");

    axios
      .post("/api/auth/twitter/post-tweet", { message, userId })
      .then((res) => {
        console.log("res: ", res);
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Login Successful
          </h1>
          {isLoading && <p>Loading...</p>}
          {!isLoading && (
            <>
              <div className="mb-4 flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-3"
              />
              <br />
              <Button onClick={postTweet} className="mt-3">
                Post Static Tweet
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default CallbackPage;
