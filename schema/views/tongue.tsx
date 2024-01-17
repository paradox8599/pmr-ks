import React from 'react'
import { type FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields'
import { type controller } from '@keystone-6/core/fields/types/json/views'
import { useJson } from './hooks/useJson'
type FieldValue = {
  body: string,
  colour: string,
  coatColor: string
}
const initialValue: FieldValue = {
  body: "",
  colour: "",
  coatColor: ""
}

export const Field = ({ value, onChange }: FieldProps<typeof controller>) => {
  const { data, setData } = useJson<FieldValue>({ value, onChange, initialValue })

  return (
    <FieldContainer>
      <FieldLabel>Tongue</FieldLabel>

      <div>
        <div>Body (shape & teeth mark & dry?)</div>
        <TextInput
          value={data.body}
          onChange={(e) => {
            setData({ ...data, body: e.target.value })
          }}></TextInput>
      </div>

      <div>
        <div>Colour</div>
        <TextInput
          value={data.colour}
          onChange={(e) => {
            setData({ ...data, colour: e.target.value })
          }}></TextInput>
      </div>

      <div>
        <div>Coat & Color</div>
        <TextInput
          value={data.coatColor}
          onChange={(e) => {
            setData({ ...data, coatColor: e.target.value })
          }}></TextInput>
      </div>

    </FieldContainer>
  )
}

