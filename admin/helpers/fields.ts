import { timestamp } from "@keystone-6/core/fields";
import { BaseListTypeInfo } from "@keystone-6/core/types";

export function createdAtField<T extends BaseListTypeInfo>() {
  return timestamp<T>({
    defaultValue: { kind: "now" },
    ui: {
      createView: { fieldMode: "hidden" },
      itemView: { fieldMode: "read", fieldPosition: "sidebar" },
    },
  });
}
