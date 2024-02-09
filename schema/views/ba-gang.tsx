import { type controller } from "@keystone-6/core/fields/types/json/views";
import { type FieldProps } from "@keystone-6/core/types";
import { FieldContainer, FieldLabel, Switch } from "@keystone-ui/fields";
import React from "react";
import { useJson } from "./hooks/useJson";

type FieldValue = {
  labelOn: string;
  labelOff: string;
  label: string;
  value: boolean;
}[];
const initialValue: FieldValue = [
  {
    label: "Yin / Yang",
    labelOff: "Yin",
    labelOn: "Yang",
    value: false,
  },
  {
    label: "Xu / Shi",
    labelOff: "Xu",
    labelOn: "Shi",
    value: false,
  },
  {
    label: "Biao / Li",
    labelOff: "Biao",
    labelOn: "Li",
    value: false,
  },
  {
    label: "Han / Re",
    labelOff: "Han",
    labelOn: "Re",
    value: false,
  },
] as const;

export const Field = ({ value, onChange }: FieldProps<typeof controller>) => {
  const { data, setData } = useJson<FieldValue>({
    value,
    onChange,
    initialValue,
  });

  return (
    <FieldContainer>
      <FieldLabel>Ba Gang</FieldLabel>
      {data.map((d, i) => {
        return (
          <div
            key={i.toString()}
            style={{ display: "flex", alignItems: "center", margin: "1rem 0" }}
          >
            <div style={{ marginRight: "1rem", width: "2rem" }}>
              {d.labelOff}
            </div>
            <Switch
              checked={d.value}
              onChange={(checked) => {
                setData(
                  data.map((d, j) => {
                    if (i === j) {
                      return { ...d, value: checked };
                    }
                    return d;
                  }),
                );
              }}
            >
              {" "}
            </Switch>

            <div style={{ marginLeft: "1rem" }}>{d.labelOn}</div>
          </div>
        );
      })}
    </FieldContainer>
  );
};
