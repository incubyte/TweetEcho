import { TwitterApi } from "twitter-api-v2";

const twitterApiClient = new TwitterApi({
  clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
  clientSecret: process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET!,
});

const twitterCallbackUrl: string = process.env.NEXT_PUBLIC_TWITTER_CALLBACK_URL!;
const twitterScope = ["tweet.read", "users.read", "tweet.write", "offline.access"];

export { twitterApiClient, twitterCallbackUrl, twitterScope };
