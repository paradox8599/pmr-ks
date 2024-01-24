import { type Lists } from ".keystone/types";

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { image, text } from "@keystone-6/core/fields";

import { IsNotRole, IsRole } from "../admin/helpers/role";
import { Role } from "../src/lib/types/auth";
import { createdAtField, updatedAtField } from "./fields/dates";
import { afterOperation } from "./History";

export const Client: Lists.Client = list({
  access: {
    operation: {
      create: allowAll,
      query: allowAll,
      update: IsRole(Role.Admin),
      delete: IsRole(Role.Admin),
    },
    filter: {
      query: allowAll,
      update: IsRole(Role.Admin),
      delete: IsRole(Role.Admin),
    },
  },
  ui: {
    hideDelete: IsNotRole(Role.Admin),
  },
  hooks: { afterOperation },
  fields: {
    name: text({ validation: { isRequired: true } }),
    phone: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    consentPage1: image({ storage: "r2_image" }),
    consentPage2: image({ storage: "r2_image" }),
    consentPage3: image({ storage: "r2_image" }),
    consentPage4: image({ storage: "r2_image" }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
