import { type Lists } from ".keystone/types";

import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { image, text, virtual } from "@keystone-6/core/fields";

import { BUCKET } from "../src/lib/variables";
import { createdAtField, updatedAtField } from "./fields/dates";

// TODO: thumbnail
export const Image: Lists.Image = list({
  access: allowAll,
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          return item.description || item.id;
        },
      }),
    }),
    description: text({ ui: { description: "(Optional)" } }),
    image: image({ storage: "r2_image" }),
    url: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          return `${BUCKET.customUrl}/${BUCKET.imagePrefix}${item.image_id}.${item.image_extension}`;
        },
      }),
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
