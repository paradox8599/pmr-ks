import { randomBytes } from "crypto";
import { statelessSessions } from "@keystone-6/core/session";
import { KS_SESSION_SECRET } from "../src/lib/variables";

// for a stateless session, a SESSION_SECRET should always be provided
//   especially in production (statelessSessions will throw if SESSION_SECRET is undefined)
// let sessionSecret = process.env.SESSION_SECRET;
// if (!sessionSecret && process.env.NODE_ENV !== "production") {
//   sessionSecret = randomBytes(32).toString("hex");
// }

// statelessSessions uses cookies for session tracking
//   these cookies have an expiry, in seconds
//   we use an expiry of 30 days for this starter
const sessionMaxAge = 60 * 60 * 24 * 30;

// you can find out more at https://keystonejs.com/docs/apis/session#session-api
export const statelessSession = statelessSessions({
  maxAge: sessionMaxAge,
  secret: KS_SESSION_SECRET,
  secure: process.env.NODE_ENV === "production",
});
