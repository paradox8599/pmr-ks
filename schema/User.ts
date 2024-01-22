import { type Lists } from ".keystone/types";

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { password, select, text } from "@keystone-6/core/fields";

import { IsRole } from "../admin/helpers/role";
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
      delete: IsRole(Role.Admin),
    },
    filter: {
      query: filterAdminOrSelf,
      update: filterAdminOrSelf,
    },
  },
  ui: {
    hideCreate: ({ session }) => !IsRole(Role.Admin)(session),
    hideDelete: ({ session }) => !IsRole(Role.Admin)(session),
  },
  fields: {
    name: text({}),
    email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
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
