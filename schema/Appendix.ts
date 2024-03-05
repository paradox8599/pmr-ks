import { type Lists } from ".keystone/types";

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { image, text } from "@keystone-6/core/fields";

import { createdAtField, updatedAtField } from "./fields/dates";
import { IsRole } from "../admin/helpers/role";
import { Role } from "../src/lib/types/auth";

export const Appendix: Lists.Appendix = list({
  access: {
    operation: {
      create: allowAll,
      query: allowAll,
      update:allowAll, 
      delete:allowAll, 
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    image: image({ storage: "r2_image" }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
