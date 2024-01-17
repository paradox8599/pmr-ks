import { type Lists } from ".keystone/types";

import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { image, text, virtual } from "@keystone-6/core/fields";
import { createdAtField, updatedAtField } from "./fields/dates";

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
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
