import { list } from "@keystone-6/core"
import { allowAll } from "@keystone-6/core/access"
import { json, relationship, select } from "@keystone-6/core/fields"
import { type Lists } from ".keystone/types";
import { document } from "@keystone-6/fields-document";
import { createdAtField, updatedAtField } from "../admin/helpers/fields";

export const gsaForm: Lists.gsaForm = list({
  access: allowAll,
  fields: {
    // TODO: add label or name
    // label: virtual({}),

    client: relationship({ ref: "Client", many: false }),
    therapist: relationship({ ref: "User", many: false }),
    main: document({
      ui: { description: "Main Complaint & History" }, formatting: true,
    }),

    // TODO: observation

    assessments: json({
      ui: {
        description: "One or more of the following Assessments should be performed at initial consultation.",
        views: "./schema/views/assessment-checkboxes",
      }
    }),
    reuslts: document({
      ui: { description: "Assessment Conducted & Results" },
      formatting: true,
    }),
    details: document({
      ui: { description: "Treatment Details" }, formatting: true
    }),
    pressure: select({
      options: [
        { label: "Soft", value: "soft" },
        { label: "Medium", value: "medium" },
        { label: "Hard", value: "hard" },
      ]
    }),
    other: document({
      ui: { description: "Other Advises" }, formatting: true
    }),
    risks: document({
      ui: { description: "Possible Risks and Complications - advice to Clients given" },
      formatting: true,
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
