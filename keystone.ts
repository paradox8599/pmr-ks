import "dotenv/config";

import { config } from "@keystone-6/core";

import { session, withAuth } from "./auth";
import { lists } from "./schema/_lists";
import {
  DATABASE_URL,
  DB_PROVIDER,
  GRAPHQL_PATH,
  KS_PORT,
} from "./src/lib/variables";
import { Role } from "./src/lib/types/auth";

export default withAuth(
  config({
    server: {
      port: KS_PORT,
    },
    ui: {
      isAccessAllowed: (ctx) =>
        (ctx.session?.data?.role & (Role.Admin | Role.User)) > 0,
    },
    storage: {
      r2_image: {
        kind: "s3",
        type: "image",
        region: "auto",
        bucketName: process.env.STORE_IMAGE_BUCKET!,
        accessKeyId: process.env.STORE_IMAGE_ACCESS_KEY_ID,
        secretAccessKey: process.env.STORE_IMAGE_SECRET_ACCESS_KEY,
        endpoint: process.env.STORE_IMAGE_ENDPOINT,
        generateUrl: (path) => {
          const original = new URL(path);
          const customUrl = new URL(
            original.pathname,
            process.env.STORE_IMAGE_CUSTOM_URL ?? original.origin,
          );
          return customUrl.href;
        },
        pathPrefix: process.env.STORE_IMAGE_PREFIX,
      },
    },
    db: {
      provider: DB_PROVIDER,
      url: DATABASE_URL,
    },
    lists,
    graphql: { path: GRAPHQL_PATH },
    session,
  }),
);
