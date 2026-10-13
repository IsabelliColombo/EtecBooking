import { getDatabase } from "@/lib/mongodb";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

type LoginRateLimitDocument = {
  key: string;
  attempts: number;
  windowStartedAt: Date;
  expiresAt: Date;
};

export type LoginRateLimitStatus = {
  limited: boolean;
  retryAfterSeconds: number;
};

function getRetryAfterSeconds(windowStartedAt: Date, now: Date): number {
  return Math.max(
    1,
    Math.ceil((windowStartedAt.getTime() + WINDOW_MS - now.getTime()) / 1000),
  );
}

export async function consumeLoginAttempt(
  matricula: string,
  now = new Date(),
): Promise<LoginRateLimitStatus> {
  const database = await getDatabase();
  const windowStart = new Date(now.getTime() - WINDOW_MS);
  const nextExpiry = new Date(now.getTime() + WINDOW_MS);
  const record = await database
    .collection<LoginRateLimitDocument>("login_rate_limits")
    .findOneAndUpdate(
      { key: matricula },
      [
        {
          $set: {
            key: matricula,
            attempts: {
              $cond: [
                {
                  $lt: [
                    { $ifNull: ["$windowStartedAt", new Date(0)] },
                    windowStart,
                  ],
                },
                1,
                { $add: [{ $ifNull: ["$attempts", 0] }, 1] },
              ],
            },
            windowStartedAt: {
              $cond: [
                {
                  $lt: [
                    { $ifNull: ["$windowStartedAt", new Date(0)] },
                    windowStart,
                  ],
                },
                now,
                "$windowStartedAt",
              ],
            },
            expiresAt: {
              $cond: [
                {
                  $lt: [
                    { $ifNull: ["$windowStartedAt", new Date(0)] },
                    windowStart,
                  ],
                },
                nextExpiry,
                "$expiresAt",
              ],
            },
          },
        },
      ],
      { upsert: true, returnDocument: "after" },
    );

  if (!record || record.attempts <= MAX_ATTEMPTS) {
    return { limited: false, retryAfterSeconds: 0 };
  }

  return {
    limited: true,
    retryAfterSeconds: getRetryAfterSeconds(record.windowStartedAt, now),
  };
}

export async function clearLoginRateLimit(matricula: string): Promise<void> {
  const database = await getDatabase();
  await database.collection<LoginRateLimitDocument>("login_rate_limits").deleteOne({
    key: matricula,
  });
}
