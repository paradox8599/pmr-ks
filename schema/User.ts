import { type Lists } from ".keystone/types";

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { password, select, text } from "@keystone-6/core/fields";

import { IsNotRole, IsRole } from "../admin/helpers/role";
import { Role, RoleName } from "../src/lib/types/auth";
import { createdAtField, updatedAtField } from "./fields/dates";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function filterAdminOrSelf({ session }: any) {
  return (
    session?.data?.role === Role.Admin || {
      id: { equals: session?.itemId },
    }
  );
}

export const User: Lists.User = list({
  access: {
    operation: {
      create: IsRole(Role.Admin),
      query: allowAll,
      update: allowAll,
      delete: allowAll,
    },
    filter: {
      update: filterAdminOrSelf,
      delete: ({ session }) =>
        IsRole(Role.Admin)({ session }) && {
          id: { not: { equals: session.itemId } },
        },
    },
  },
  ui: {
    hideCreate: IsNotRole(Role.Admin),
    hideDelete: IsNotRole(Role.Admin),
  },
  hooks: {
    validateDelete: async ({
      addValidationError,
      item,
      operation,
      context,
    }) => {
      if (operation === "delete") {
        let count = await context.sudo().query.gsaForm.count({
          where: { therapist: { id: { equals: item.id } } },
        });
        if (count > 0) {
          addValidationError("Cannot delete user with GSA forms");
        }
        count += await context.sudo().query.cmForm.count({
          where: { therapist: { id: { equals: item.id } } },
        });
        if (count > 0) {
          addValidationError("Cannot delete user with CM forms");
        }
      }
    },
  },
  fields: {
    name: text({}),
    email: text({
      validation: { isRequired: true },
      isIndexed: "unique",
      ui: { itemView: { fieldMode: "read" } },
    }),
    password: password({ validation: { isRequired: true } }),
    role: select({
      type: "integer",
      defaultValue: Role.User,
      options: Object.keys(Role)
        .filter((v) => Number.isNaN(Number(v)))
        .map((key) => ({
          label: key,
          value: Role[key as RoleName],
        })),
      ui: { itemView: { fieldMode: "read", fieldPosition: "sidebar" } },
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
