-- CreateTable
CREATE TABLE "user_metadata" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "writing_style" JSONB NOT NULL,
    "hashtag_pattern" JSONB NOT NULL,
    "emoji_usage" JSONB NOT NULL,
    "sentence_and_vocab" JSONB NOT NULL,
    "top_performing_tweets" JSONB NOT NULL,
    "engagement_trends" JSONB NOT NULL,

    CONSTRAINT "user_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_content" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_content_pkey" PRIMARY KEY ("id")
);
