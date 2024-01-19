import { type FieldProps } from "@keystone-6/core/types";
import { type controller } from "@keystone-6/core/fields/types/json/views";

import React from "react";
import dynamic from "next/dynamic";
import { FieldContainer, FieldLabel } from "@keystone-ui/fields";

import { globalStyles as styles } from "./global.style";

// dynamic import to avoid SSR
const Kanvas = dynamic(() => import("./kanvas"), { ssr: false });

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <div style={styles.description}>{field.description}</div>
      <div>
        <div>
          <Kanvas value={value} onChange={onChange}></Kanvas>
        </div>
      </div>
    </FieldContainer>
  );
};
