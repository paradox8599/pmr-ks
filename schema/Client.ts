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
      update: allowAll,
      delete: IsRole(Role.Admin),
    },
    filter: {
      query: allowAll,
      update: allowAll,
      delete: IsRole(Role.Admin),
    },
  },
  ui: {
    hideDelete: IsNotRole(Role.Admin),
    listView: {
      initialSort: { field: "createdAt", direction: "DESC" },
      initialColumns: ["name", "email", "phone", "note", "createdAt"],
    },
  },
  hooks: {
    afterOperation,
    resolveInput: async ({ item, inputData, resolvedData }) => {
      const firstName = inputData.firstName || item?.firstName;
      const lastName = inputData.lastName || item?.lastName;
      resolvedData.name = `${firstName} ${lastName}`;
      return resolvedData;
    },
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
    name: text({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
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
