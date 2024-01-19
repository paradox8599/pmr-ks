import { type Lists } from ".keystone/types";

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, text } from "@keystone-6/core/fields";

import { createdAtField, updatedAtField } from "./fields/dates";

export const Client: Lists.Client = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    phone: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    consentForm: relationship({
      ref: "Image",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["label", "image", "url"],
        inlineCreate: { fields: ["description", "image"] },
        inlineConnect: true,
      },
      // hooks: {
      //   afterOperation: async ({ operation, item, context, inputData }) => {
      //     console.log(inputData);
      //     async function fetchImages(id: string) {
      //       return await context.query.Client.findOne({
      //         where: { id },
      //         query: "consentForm { id }",
      //       });
      //     }
      //
      //     if (operation === "create") return;
      //     if (operation === "update") {
      //       // const images = await fetchImages(item.id);
      //       // console.log(images);
      //     }
      //   },
      // },
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
