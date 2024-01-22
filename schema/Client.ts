import { type Lists } from ".keystone/types";

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, text } from "@keystone-6/core/fields";

import { IsRole } from "../admin/helpers/role";
import { Role } from "../src/lib/types/auth";
import { createdAtField, updatedAtField } from "./fields/dates";

export const Client: Lists.Client = list({
  access: {
    operation: {
      create: allowAll,
      query: allowAll,
      update: allowAll,
      delete: IsRole(Role.Admin),
    },
    filter: {
      query: allowAll,
      update: ({ session }) => {
        return IsRole(Role.Admin)(session);
      },
    },
  },
  ui: { hideDelete: ({ session }) => !IsRole(Role.Admin)(session) },
  fields: {
    name: text({ validation: { isRequired: true } }),
    phone: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    consentForm: relationship({
      ref: "Image",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["label", "image", "url"],
        inlineCreate: { fields: ["description", "image"] },
        inlineConnect: true,
      },
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
