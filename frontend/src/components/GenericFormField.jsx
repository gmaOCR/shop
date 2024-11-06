import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const GenericFormField = ({
  name,
  label,
  type,
  options = [],
  onChange,
  value,
}) => {
  const { control } = useFormContext()
  const id = `${name}-field`

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {type === 'select' ? (
            <>
              <FormLabel htmlFor={id}>{label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    onChange?.({ target: { name, value } })
                  }}
                  defaultValue={field.value}
                  value={value}
                  aria-labelledby={`${name}-label`}
                >
                  <SelectTrigger id={id}>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type={type}
                  onChange={(e) => {
                    field.onChange(e)
                    onChange?.(e)
                  }}
                />
              </FormControl>
            </>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export default GenericFormField
