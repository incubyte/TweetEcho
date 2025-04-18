import { getFromMemory } from "@/app/api/memory";
import { twitterApiClient } from "@/config/twitter-config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { message } = await request.json();
  const refreshToken = getFromMemory("refreshToken");
  console.log("🚀 ~ POST ~ refreshToken:", refreshToken);

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterApiClient.refreshOAuth2Token(refreshToken!);
  console.log("🚀 ~ POST ~ accessToken:", accessToken);
  console.log("🚀 ~ POST ~ newRefreshToken:", newRefreshToken);

  const { data } = await refreshedClient.v2.tweet(message);

  return NextResponse.json({ data }, { status: 200 });
};
