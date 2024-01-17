import { type Lists } from ".keystone/types";

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, text } from "@keystone-6/core/fields";

import { createdAtField, updatedAtField } from "./fields/dates";

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
