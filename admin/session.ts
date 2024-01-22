import { createClient } from "redis";
import { statelessSessions, storedSessions } from "@keystone-6/core/session";
import { randomBytes } from "crypto";

// for a stateless session, a SESSION_SECRET should always be provided
//   especially in production (statelessSessions will throw if SESSION_SECRET is undefined)
let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = randomBytes(32).toString("hex");
}

// statelessSessions uses cookies for session tracking
//   these cookies have an expiry, in seconds
//   we use an expiry of 30 days for this starter
const sessionMaxAge = 60 * 60 * 24 * 30;

// you can find out more at https://keystonejs.com/docs/apis/session#session-api
export const statelessSession = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
  secure: process.env.NODE_ENV === "production",
});

// stored sessions example
// https://github.com/keystonejs/keystone/blob/b52713b1f85ec02622dd3b5679f31ea9e2c0186c/examples/redis-session-store/keystone.ts
export const redis = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

export const storedSession = storedSessions({
  store: ({ maxAge }) => ({
    async get(key) {
      let result = await redis.get(key);
      if (typeof result === "string") {
        return JSON.parse(result);
      }
    },
    async set(key, value) {
      await redis.setEx(key, maxAge, JSON.stringify(value));
    },
    async delete(key) {
      await redis.del(key);
    },
  }),
  secret: sessionSecret!,
});
