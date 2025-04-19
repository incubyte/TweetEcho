// import { saveInMemory } from "@/app/api/memory";
import {
  twitterApiClient,
  twitterCallbackUrl,
  twitterScope,
} from "@/config/twitter-config";
import { NextResponse } from "next/server";

// api/(auth)/twitter/get-url
export const GET = async () => {
  const authResponse = twitterApiClient.generateOAuth2AuthLink(
    twitterCallbackUrl,
    {
      scope: twitterScope,
    }
  );

  const codeVerifier = authResponse.codeVerifier;
  const authUrl = authResponse.url;

  return NextResponse.json({ authUrl, codeVerifier }, { status: 200 });
};
