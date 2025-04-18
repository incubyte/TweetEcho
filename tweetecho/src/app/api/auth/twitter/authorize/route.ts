import { getFromMemory, saveInMemory } from "@/app/api/memory";
import { twitterApiClient, twitterCallbackUrl } from "@/config/twitter-config";
import { NextRequest, NextResponse } from "next/server";

// api/(auth)/twitter/authorize
  export const POST = async (request: NextRequest) => {
    const { code } = await request.json();
    const codeVerifier = getFromMemory("codeVerifier");

    try {
      const { client, accessToken, refreshToken } = await twitterApiClient.loginWithOAuth2({
        code: code,
        codeVerifier: codeVerifier!,
        redirectUri: twitterCallbackUrl,
      });

      const { data: userData } = await client.v2.me();
      // TODO: remove this line
      const { data: tweet } = await client.v2.tweet("Hello World, I'm testing something!");
      console.log("🚀 ~ POST ~ tweet:", tweet);

      saveInMemory("accessToken", accessToken);
      saveInMemory("refreshToken", refreshToken!);
      saveInMemory("userData", JSON.stringify(userData));

      return NextResponse.json({ message: "hello world!" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  };
