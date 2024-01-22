import { getContext } from "@keystone-6/core/context";
import PrismaModule from "@prisma/client";
import config from "../../keystone";
import { Context } from ".keystone/types";

// Making sure multiple prisma clients are not created during hot reloading
export const keystoneContext: Context =
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (globalThis as any).keystoneContext || getContext(config, PrismaModule);

if (process.env.NODE_ENV !== "production") {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (globalThis as any).keystoneContext = keystoneContext;
}
