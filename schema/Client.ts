import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, text } from "@keystone-6/core/fields";

import { type Lists } from ".keystone/types";
import { createdAtField, updatedAtField } from "../admin/helpers/fields";

export const Client: Lists.Client = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    phone: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    consentForm: relationship({ ref: "Image", many: true }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});

