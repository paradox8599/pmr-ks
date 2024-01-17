import { type Lists } from ".keystone/types";

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, password, select } from "@keystone-6/core/fields";

import { Role, RoleName } from "../src/lib/types/auth";
import { createdAtField, updatedAtField } from "./fields/dates";

export const User: Lists.User = list({
  access: allowAll,
  fields: {
    name: text({}),
    email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    password: password({ validation: { isRequired: true } }),
    role: select({
      type: "integer",
      defaultValue: Role.User,
      options: Object.keys(Role)
        .filter((v) => isNaN(Number(v)))
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
