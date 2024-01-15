import { list } from "@keystone-6/core"
import { allowAll } from "@keystone-6/core/access"
import { json, relationship } from "@keystone-6/core/fields"
import { type Lists } from ".keystone/types";
import { document } from "@keystone-6/fields-document";

export const FormGSA: Lists.FormGSA = list({
  access: allowAll,
  fields: {
    Client: relationship({ ref: "Client", many: false }),
    therapist: relationship({ ref: "User", many: false }),
    mainComplaintNHistory: document({
      ui: { description: "Main Complaint & History" },
      formatting: true,
    }),
    // TODO: observation
    assessments: json({
      ui: {
        description: "One or more of the following Assessments should be performed at initial consultation.",
        views: "./schema/views/assessment-checkboxes",
      }
    }),
  }
});
