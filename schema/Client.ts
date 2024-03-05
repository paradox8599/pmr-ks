import { type Lists } from ".keystone/types";

import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { image, text, virtual } from "@keystone-6/core/fields";

import { IsNotRole, IsRole } from "../admin/helpers/role";
import { Role } from "../src/lib/types/auth";
import { createdAtField, updatedAtField } from "./fields/dates";
import { afterOperation } from "./History";

export const Client: Lists.Client = list({
  access: {
    operation: {
      create: allowAll,
      query: allowAll,
      update:allowAll, 
      delete: IsRole(Role.Admin),
    },
    filter: {
      query: allowAll,
      update:allowAll, 
      delete: IsRole(Role.Admin),
    },
  },
  ui: {
    hideDelete: IsNotRole(Role.Admin),
    listView: { initialColumns: ["fullName", "email", "phone", "createdAt"] },
  },
  hooks: {
    afterOperation,
    validateDelete: async ({
      addValidationError,
      item,
      operation,
      context,
    }) => {
      if (operation === "delete") {
        let count = await context.sudo().query.gsaForm.count({
          where: { client: { id: { equals: item.id } } },
        });
        if (count > 0) {
          addValidationError("Cannot delete client with GSA forms");
        }
        count += await context.sudo().query.cmForm.count({
          where: { client: { id: { equals: item.id } } },
        });
        if (count > 0) {
          addValidationError("Cannot delete client with CM forms");
        }
      }
    },
  },
  fields: {
    name: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: async (item) => [item.firstName, item.lastName].join(" "),
      }),
    }),
    firstName: text({ ui: { itemView: { fieldPosition: "sidebar" } } }),
    lastName: text({ ui: { itemView: { fieldPosition: "sidebar" } } }),
    email: text({ ui: { itemView: { fieldPosition: "sidebar" } } }),
    phone: text({ ui: { itemView: { fieldPosition: "sidebar" } } }),
    note: text({ ui: { itemView: { fieldPosition: "sidebar" } } }),
    consentPage1: image({ storage: "r2_image" }),
    consentPage2: image({ storage: "r2_image" }),
    consentPage3: image({ storage: "r2_image" }),
    consentPage4: image({ storage: "r2_image" }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
