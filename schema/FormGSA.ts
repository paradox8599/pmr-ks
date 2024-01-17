import { type Lists } from ".keystone/types";

import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { json, relationship, select, virtual } from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";

import { createdAtField, updatedAtField } from "./fields/dates";

export const gsaForm: Lists.gsaForm = list({
  access: allowAll,
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
            `[${item.createdAt!.toISOString().replace("T", " ").replace("Z", "")}]` +
            ` ${client.name} - ${therapist.name}`
          );
        },
      }),
    }),

    client: relationship({
      ref: "Client",
      many: false,
      ui: { itemView: { fieldPosition: "sidebar" } },
    }),
    therapist: relationship({
      ref: "User",
      many: false,
      ui: { itemView: { fieldPosition: "sidebar" } },
    }),
    main: document({
      ui: { description: "Main Complaint & History" },
      formatting: true,
    }),

    // TODO: observation

    assessmentItems: json({
      ui: {
        description:
          "One or more of the following Assessments should be performed at initial consultation.",
        views: "./schema/views/assessment-checkboxes",
      },
    }),
    assessmentReuslts: document({
      ui: { description: "Assessment Conducted & Results" },
      formatting: true,
    }),
    details: document({
      ui: { description: "Treatment Details" },
      formatting: true,
    }),
    pressure: select({
      options: [
        { label: "Soft", value: "soft" },
        { label: "Medium", value: "medium" },
        { label: "Hard", value: "hard" },
      ],
    }),
    other: document({
      ui: { description: "Other Advises" },
      formatting: true,
    }),
    risks: document({
      ui: {
        description:
          "Possible Risks and Complications - advice to Clients given",
      },
      formatting: true,
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
