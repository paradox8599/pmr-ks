import { type Lists } from ".keystone/types";

import { graphql, list } from "@keystone-6/core";
import { denyAll } from "@keystone-6/core/access";
import { json, relationship, text, virtual } from "@keystone-6/core/fields";

import { IsNotRole, IsRole } from "../admin/helpers/role";
import { Role } from "../src/lib/types/auth";
import { createdAtField } from "./fields/dates";

export const History: Lists.History = list({
  access: {
    operation: {
      create: denyAll,
      query: IsRole(Role.Admin),
      update: denyAll,
      delete: IsRole(Role.Admin),
    },
    filter: { query: IsRole(Role.Admin) },
  },
  ui: {
    itemView: { defaultFieldMode: "read" },
    hideDelete: IsNotRole(Role.Admin),
    hideCreate: () => true,
    isHidden: IsNotRole(Role.Admin),
    listView: {
      initialSort: { field: "operationAt", direction: "DESC" },
      initialColumns: [
        "operator",
        "collection",
        "operation",
        "inputKeys",
        "itemId",
        "operationAt",
      ],
    },
  },
  fields: {
    inputKeys: virtual({
      ui: { itemView: { fieldMode: "read" } },
      field: graphql.field({
        type: graphql.String,
        resolve: async (item, _args, _context) => {
          const inputData = JSON.parse(JSON.stringify(item.inputData ?? {}));
          const inputKeys = Object.keys(inputData).join(", ");
          return inputKeys;
        },
      }),
    }),
    operator: relationship({ ref: "User", ui: { hideCreate: true } }),
    collection: text({ validation: { isRequired: true } }),
    operation: text({}),
    itemId: text({}),
    inputData: json({}),
    resolvedData: json({}),
    originalItem: json({}),
    item: json({}),
    operationAt: createdAtField(),
  },
});

export const afterOperation = async ({
  item,
  operation,
  originalItem,
  inputData,
  resolvedData,
  listKey,
  context,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) => {
  await context.sudo().query.History.createOne({
    data: {
      operator: { connect: { id: context.session.itemId } },
      collection: listKey,
      operation,
      itemId: item?.id ?? originalItem?.id,
      inputData,
      resolvedData: JSON.parse(JSON.stringify(resolvedData ?? {})),
      originalItem: JSON.parse(JSON.stringify(originalItem ?? {})),
      item: JSON.parse(JSON.stringify(item ?? {})),
    },
  });
};
