import { type controller } from "@keystone-6/core/fields/types/json/views";

import { type FieldProps } from "@keystone-6/core/types";
import { FieldContainer, FieldLabel } from "@keystone-ui/fields";
import React from "react";

import dynamic from "next/dynamic";

import { useJson } from "./hooks/useJson";
import { globalStyles as styles } from "./global.style";

const Kanvas = dynamic(() => import("./kanvas"), { ssr: false });

type FieldValue = {};
const initialValue: FieldValue = {} as const;

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  const { data, setData } = useJson<FieldValue>({
    value,
    onChange,
    initialValue,
  });

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <div style={styles.description}>{field.description}</div>
      <div>
        <p>Canvas</p>
        <canvas width={300} height={300}></canvas>
        <div>
          <Kanvas></Kanvas>
        </div>
      </div>
    </FieldContainer>
  );
};
