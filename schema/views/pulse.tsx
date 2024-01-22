import { type controller } from "@keystone-6/core/fields/types/json/views";
import { type FieldProps } from "@keystone-6/core/types";
import { FieldContainer, FieldLabel, TextInput } from "@keystone-ui/fields";
import React from "react";
import { useJson } from "./hooks/useJson";

type FieldValue = {
  left: {
    cun: string;
    guan: string;
    chi: string;
  };
  right: {
    cun: string;
    guan: string;
    chi: string;
  };
  summary: string;
};
const initialValue: FieldValue = {
  left: {
    cun: "",
    guan: "",
    chi: "",
  },
  right: {
    cun: "",
    guan: "",
    chi: "",
  },
  summary: "",
} as const;

export const Field = ({ value, onChange }: FieldProps<typeof controller>) => {
  const { data, setData } = useJson<FieldValue>({
    value,
    onChange,
    initialValue,
  });

  return (
    <FieldContainer>
      <FieldLabel>Pulse</FieldLabel>
      {(["left", "right"] as const).map((side, i) => {
        return (
          <div key={`${i}`}>
            <h5>{side.toUpperCase()}</h5>
            {(["cun", "guan", "chi"] as const).map((k, j) => {
              return (
                <div key={`${j}`}>
                  <div>
                    {side}: {k.toUpperCase()}
                  </div>
                  <TextInput
                    value={data[side][k]}
                    onChange={(e) => {
                      setData({
                        ...data,
                        [side]: { ...data[side], [k]: e.target.value },
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
      <h5>脉总结</h5>
      <TextInput
        value={data.summary}
        onChange={(e) => setData({ ...data, summary: e.target.value })}
      />
    </FieldContainer>
  );
};
