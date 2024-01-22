import "dotenv/config";

import { config } from "@keystone-6/core";

import { withAuth } from "./admin/auth";
import { lists } from "./schema/_lists";
import { redis, storedSession } from "./admin/session";
import {
  BUCKET,
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
        bucketName: BUCKET.bucketName!,
        accessKeyId: BUCKET.accessKeyId,
        secretAccessKey: BUCKET.secretAccessKey,
        endpoint: BUCKET.endpoint,
        pathPrefix: BUCKET.imagePrefix,
        generateUrl: (path) => {
          const original = new URL(path);
          const customUrl = new URL(original.pathname, BUCKET.customUrl);
          return customUrl.href;
        },
      },
    },
    db: {
      provider: DB_PROVIDER,
      url: DATABASE_URL,
      async onConnect() {
        await redis.connect();
      },
    },
    lists,
    graphql: { path: GRAPHQL_PATH },
    session: storedSession,
  }),
);
