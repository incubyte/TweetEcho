import getPrisma from "@/config/prisma-config";
import { twitterApiClient } from "@/config/twitter-config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { message, userId } = await request.json();

  const user = await getPrisma().user.findUnique({
    where: {
      id: userId,
    },
  });

  const refreshToken = user?.refreshToken;
  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token not found" },
      { status: 400 }
    );
  }

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterApiClient.refreshOAuth2Token(refreshToken!);

  await getPrisma().user.update({
    where: {
      id: userId,
    },
    data: {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    },
  });

  const { data } = await refreshedClient.v2.tweet(message);

  return NextResponse.json({ data }, { status: 200 });
};
