import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, password, select, file, image } from "@keystone-6/core/fields";

import { type Lists } from ".keystone/types";
import { Role, RoleName } from "../src/lib/types/auth";
import { createdAtField, updatedAtField } from "../admin/helpers/fields";

export const Patient: Lists.Patient = list({
  access: allowAll,
  fields: {
    name: text({}),
    // email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    phone: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    file: file({ storage: "r2_file" }),
    image: image({ storage: "r2_image" }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});

