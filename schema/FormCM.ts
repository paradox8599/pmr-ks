import { type Lists } from ".keystone/types";

import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  checkbox,
  json,
  relationship,
  text,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";

import { IsNotRole, IsRole } from "../admin/helpers/role";
import { Role } from "../src/lib/types/auth";
import { createdAtField, updatedAtField } from "./fields/dates";
import { afterOperation } from "./History";

export const cmForm: Lists.cmForm = list({
  access: {
    operation: {
      create: allowAll,
      query: allowAll,
      update: allowAll,
      delete: IsRole(Role.Admin),
    },
    filter: {
      update: ({ session }) =>
        IsRole(Role.Admin)({ session }) || {
          therapist: { id: { equals: session.itemId } },
        },
    },
  },
  ui: {
    hideDelete: IsNotRole(Role.Admin),
    listView: {
      initialSort: { field: "updatedAt", direction: "DESC" },
      initialColumns: [
        "label",
        "client",
        "therapist",
        "createdAt",
        "updatedAt",
      ],
    },
  },
  hooks: { afterOperation },
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, _args, ctx) {
          const client = (await ctx.query.Client.findOne({
            where: { id: item.clientId },
            query: "name",
          })) as unknown as Lists.Client.Item;
          const therapist = (await ctx.query.User.findOne({
            where: { id: item.therapistId },
            query: "name",
          })) as unknown as Lists.User.Item;

          return (
            `[${(item.treatmentDate ?? item.createdAt)
              ?.toISOString()
              .replace("T", " ")
              .replace("Z", "")}]` + ` ${client.name} - ${therapist.name}`
          );
        },
      }),
    }),
    client: relationship({
      ref: "Client",
      many: false,
      ui: { itemView: { fieldPosition: "sidebar" } },
      hooks: {
        validateInput: ({ resolvedData, operation, addValidationError }) => {
          switch (operation) {
            case "create":
              if (!resolvedData.client?.connect) {
                addValidationError("Client is required");
              }
              break;
            case "update":
              if (resolvedData.client?.disconnect) {
                addValidationError("Client is required");
              }
              break;
          }
        },
      },
    }),
    therapist: relationship({
      ref: "User",
      many: false,
      ui: { itemView: { fieldPosition: "sidebar" } },
      hooks: {
        validateInput: ({ resolvedData, operation, addValidationError }) => {
          switch (operation) {
            case "create":
              if (!resolvedData.therapist?.connect) {
                addValidationError("Therapist is required");
              }
              break;
            case "update":
              if (resolvedData.therapist?.disconnect) {
                addValidationError("Therapist is required");
              }
              break;
          }
        },
      },
    }),
    treatmentDate: timestamp({
      defaultValue: { kind: "now" },
      ui: { itemView: { fieldPosition: "sidebar" } },
      validation: { isRequired: true },
    }),
    pregnant: checkbox({}),
    changes: text({ ui: { displayMode: "textarea" } }),
    tongue: json({ ui: { views: "./schema/views/tongue" } }),
    pulse: json({ ui: { views: "./schema/views/pulse" } }),
    baGang: json({ ui: { views: "./schema/views/ba-gang" } }),
    zangFu: text({ ui: { displayMode: "textarea" } }),
    diagnosis: text({ ui: { displayMode: "textarea" } }),
    t: text({ ui: { displayMode: "textarea" } }),
    appendix: relationship({ ref: "Appendix", many: true }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
