import { saveInMemory } from "@/app/api/memory";
import {
  twitterApiClient,
  twitterCallbackUrl,
  twitterScope,
} from "@/config/twitter-config";
import { NextResponse } from "next/server";

// api/(auth)/twitter/get-url
export const GET = () => {
  const authResponse = twitterApiClient.generateOAuth2AuthLink(
    twitterCallbackUrl,
    {
      scope: twitterScope,
    }
  );

  const codeVerifier = authResponse.codeVerifier;
  const authUrl = authResponse.url;

  saveInMemory("codeVerifier", codeVerifier);

  return NextResponse.json({ authUrl }, { status: 200 });
};
