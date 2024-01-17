import { list } from "@keystone-6/core"
import { allowAll } from "@keystone-6/core/access"
import { checkbox, json, relationship, timestamp } from "@keystone-6/core/fields"
import { type Lists } from ".keystone/types";
import { document } from "@keystone-6/fields-document";
import { createdAtField, updatedAtField } from "../admin/helpers/fields";


export const cmForm: Lists.cmForm = list({
  access: allowAll,
  fields: {
    // TODO: virtual name
    client: relationship({ ref: "Client", many: false, ui: { itemView: { fieldPosition: "sidebar" } } }),
    therapist: relationship({ ref: "User", many: false, ui: { itemView: { fieldPosition: "sidebar" } } }),
    treatmentDate: timestamp({ defaultValue: { kind: "now" }, ui: { itemView: { fieldPosition: "sidebar" } } }),
    pregnant: checkbox({}),
    changes: document({ formatting: true }),
    tongue: json({ ui: { views: './schema/views/tongue' } }),
    pulse: json({ ui: { views: './schema/views/pulse' } }),
    baGang: json({ ui: { views: './schema/views/ba-gang' } }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  }
})
