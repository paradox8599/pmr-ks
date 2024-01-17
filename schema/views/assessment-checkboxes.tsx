import React from 'react'
import { type FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel, TextInput, Checkbox } from '@keystone-ui/fields'
import { type controller } from '@keystone-6/core/fields/types/json/views'
import { globalStyles } from './global.style'
import { useJson } from './hooks/useJson'


type AC = {
  "Cervical Flexion and Extension"?: boolean,
  "Rotation and Side Bending"?: boolean,
  "Seated Thoracic Rotation & Side Bending"?: boolean,
  "Trunk Side Bending"?: boolean,
  "Slump Test"?: boolean,
  "Apley's Scratch Test"?: boolean,
  "Pelvic Symmetries ASIS/PSIS"?: boolean,
  "Stork or Gillet Test"?: boolean,
  "Hautant's Vertebral Artery Test"?: boolean,
  "Seated Flexion"?: boolean,
  "Standing Flexion"?: boolean,
  "Arm Abduction"?: boolean,
  "Trendelenberg"?: boolean,
  "Lower Limb Squat"?: boolean,
  "Straight Leg Raise"?: boolean,
  "Other"?: string,
}

const acKeys = [
  "Cervical Flexion and Extension",
  "Rotation and Side Bending",
  "Seated Thoracic Rotation & Side Bending",
  "Trunk Side Bending",
  "Slump Test",
  "Apley's Scratch Test",
  "Pelvic Symmetries ASIS/PSIS",
  "Stork or Gillet Test",
  "Hautant's Vertebral Artery Test",
  "Seated Flexion",
  "Standing Flexion",
  "Arm Abduction",
  "Trendelenberg",
  "Lower Limb Squat",
  "Straight Leg Raise",
  "Other",
] as const;

export const Field = ({ field, value, onChange }: FieldProps<typeof controller>) => {
  const { data, setData } = useJson<AC>({ value, onChange })

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <div style={globalStyles.description}>{field.description}</div>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {acKeys.map((key, i) => {
          if (key === 'Other') {
            return <li key={i} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.25rem',
              gap: '1rem',
            }}>
              <Checkbox
                checked={data[key] !== undefined}
                onChange={(e) => {
                  setData({ ...data, [key]: e.target.checked ? "" : undefined });
                }}
              >
                {key}
              </Checkbox>
              <TextInput
                style={{
                  visibility: data[key] === undefined ? 'hidden' : 'visible',
                }}
                onChange={(e) => {
                  setData({ ...data, [key]: e.target.value })
                }}
                value={data[key] ?? ''}
              ></TextInput>
            </li>
          }
          return <li key={i} style={{ padding: '0.25rem', }} >
            <Checkbox
              checked={data[key] ?? false}
              onChange={(e) => {
                setData({ ...data, [key]: e.target.checked });
              }}
            >
              {key}
            </Checkbox>
          </li>
        })}
      </ul>
    </FieldContainer>
  )
}
