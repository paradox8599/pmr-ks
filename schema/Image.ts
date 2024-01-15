import { list } from "@keystone-6/core"
import { allowAll } from "@keystone-6/core/access"
import { image, text } from "@keystone-6/core/fields"
import { type Lists } from ".keystone/types";

export const Image: Lists.Image = list({
  access: allowAll,
  fields: {
    description: text({}),
    image: image({ storage: "r2_image" }),
  }
});
