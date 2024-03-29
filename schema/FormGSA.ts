import { type Lists } from ".keystone/types";

import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  json,
  relationship,
  select,
  text,
  virtual,
} from "@keystone-6/core/fields";

import { IsNotRole, IsRole } from "../admin/helpers/role";
import { Role } from "../src/lib/types/auth";
import { createdAtField, updatedAtField } from "./fields/dates";
import { afterOperation } from "./History";

export const gsaForm: Lists.gsaForm = list({
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
            `[${item.createdAt
              ?.toISOString()
              .replace("T", " ")
              .replace("Z", "")}]` + ` ${client.name} - ${therapist.name}`
          );
        },
      }),
    }),

    client: relationship({
      ref: "Client.gsaForms",
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
    mainConplaint: text({
      ui: {
        description: "Main Complaint & History",
        displayMode: "textarea",
      },
    }),
    observation: json({
      ui: {
        description:
          "Observation & Palpation of Posture (include major areas of asymmetry pain tension & tone)",
        views: "./schema/views/observation",
      },
    }),
    assessmentItems: json({
      ui: {
        description:
          "One or more of the following Assessments should be performed at initial consultation.",
        views: "./schema/views/assessment-checkboxes",
      },
    }),
    assessmentReuslts: text({
      ui: {
        description: "Assessment Conducted & Results",
        displayMode: "textarea",
      },
    }),
    details: text({
      ui: { description: "Treatment Details", displayMode: "textarea" },
    }),
    pressure: select({
      options: [
        { label: "Soft", value: "soft" },
        { label: "Medium", value: "medium" },
        { label: "Hard", value: "hard" },
      ],
    }),
    other: text({
      ui: { description: "Other Advises", displayMode: "textarea" },
    }),
    risks: text({
      ui: {
        description:
          "Possible Risks and Complications - advice to Clients given",
        displayMode: "textarea",
      },
    }),
    appendix: relationship({
      ref: "Appendix",
      many: true,
      ui: {
        // displayMode: "cards",
        // cardFields: ["name", "image"],
        // inlineCreate: { fields: ["name", "image"] },
        // inlineEdit: { fields: ["name", "image"] },
        // inlineConnect: true,
      },
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
