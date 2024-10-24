import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCountries } from './hooks/useCountries'
import { useShippingMethods } from './hooks/useShippingMethods'
import { GenericFormField } from './GenericFormField'

const formSchema = z.object({
  first_name: z.string().min(1, 'Le prénom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  line1: z.string().min(1, "L'adresse est requise"),
  line2: z.string().optional(),
  line3: z.string().optional(),
  line4: z.string().min(1, 'La ville est requise'),
  state: z.string().min(1, 'La région/état est requis'),
  postcode: z.string().min(1, 'Le code postal est requis'),
  country: z.string().min(1, 'Le pays est requis'),
  shipping: z.string().min(1, "La méthode d'envoi est requise"),
  phone_number: z.string().min(1, 'Le numéro de téléphone est requis'),
})

const defaultValues = {
  first_name: '',
  last_name: '',
  line1: '',
  line2: '',
  line3: '',
  line4: '',
  state: '',
  postcode: '',
  country: '',
  shipping: '',
  phone_number: '',
}

export function ShippingAddress({ onSubmit }) {
  const { countries } = useCountries()
  const { shippingMethods } = useShippingMethods()

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const { setValue, reset } = methods

  useEffect(() => {
    const savedData = localStorage.getItem('shippingFormData')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      reset(parsedData)
    }
  }, [reset])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValue(name, value, { shouldValidate: false })

    const currentData = methods.getValues()
    localStorage.setItem(
      'shippingFormData',
      JSON.stringify({ ...currentData, [name]: value }),
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GenericFormField
            name="first_name"
            label="Prénom"
            type="input"
            onChange={handleChange}
          />
          <GenericFormField
            name="last_name"
            label="Nom"
            type="input"
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <GenericFormField
            name="line1"
            label="Adresse"
            type="input"
            onChange={handleChange}
          />
          <GenericFormField
            name="line2"
            label=""
            type="input"
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GenericFormField
            name="line4"
            label="Ville"
            type="input"
            onChange={handleChange}
          />
          <GenericFormField
            name="state"
            label="Région/État"
            type="input"
            onChange={handleChange}
          />
          <GenericFormField
            name="postcode"
            label="Code postal"
            type="input"
            onChange={handleChange}
          />
          <GenericFormField
            name="phone_number"
            label="Numéro de téléphone"
            type="tel"
            onChange={handleChange}
          />
          <GenericFormField
            name="country"
            label="Pays"
            type="select"
            options={countries
              .filter((country) => country.is_shipping_country)
              .map((country) => ({
                value: country.url,
                label: country.printable_name,
              }))}
            onChange={handleChange}
          />
          <GenericFormField
            name="shipping"
            label="Envoi"
            type="select"
            options={shippingMethods.map((method) => ({
              value: method.name,
              label: `${method.price.currency} ${method.name} ${method.price.incl_tax}`,
            }))}
            onChange={handleChange}
          />
        </div>
      </form>
    </FormProvider>
  )
}

export default ShippingAddress
