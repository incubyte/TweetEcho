import { twitterApiClient, twitterCallbackUrl } from "@/config/twitter-config";
import { NextRequest, NextResponse } from "next/server";
import getPrisma from "@/config/prisma-config";

export const POST = async (request: NextRequest) => {
  const { code, codeVerifier } = await request.json();

  console.log("🚀 ~ POST ~ codeVerifier:", codeVerifier)
  if (!codeVerifier) {
    return NextResponse.json(
      { error: "Code verifier not found" },
      { status: 400 }
    );
  }

  try {
    const { client, accessToken, refreshToken } =
      await twitterApiClient.loginWithOAuth2({
        code: code,
        codeVerifier: codeVerifier.value,
        redirectUri: twitterCallbackUrl,
      });

    const { data: userData } = await client.v2.me();
    // TODO: remove this line
    // console.log("🚀 ~ POST ~ userData:", userData);
    // const { data } = await client.v2.tweet(
    //   `Hello World, I'm testing something! at ${new Date().toLocaleString()}`
    // );

    await getPrisma().user.create({
      data: {
        id: userData.id,
        accessToken: accessToken,
        refreshToken: refreshToken!,
        twitterInfo: {
          name: userData.name,
          username: userData.username,
        },
        metadata: {}, // TODO: bring metadata from here
      },
    });

    return NextResponse.json({ data: userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
