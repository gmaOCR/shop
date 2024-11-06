import React, { useEffect, useState, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { fetchCountries, fetchShippingMethods } from '../services/api'
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

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key)
  if (!data) return null

  try {
    const parsedData = JSON.parse(data)
    return JSON.parse(data)
  } catch (error) {
    console.warn(`Non-JSON data found in localStorage for key "${key}":`, data)
    return data
  }
}

export function ShippingAddress({ onSubmit, onShippingChange }) {
  const [countries, setCountries] = useState([])
  const [shippingMethods, setShippingMethods] = useState([])
  const [selectedShipping, setSelectedShipping] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const { setValue, reset, getValues } = methods

  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = getFromLocalStorage('shippingFormData')
      const savedCountry = getFromLocalStorage('selectedCountry')
      const savedShipping = getFromLocalStorage('selectedShipping')

      try {
        const [countriesData, shippingMethodsData] = await Promise.all([
          fetchCountries(),
          fetchShippingMethods(),
        ])

        setCountries(countriesData)
        setShippingMethods(shippingMethodsData)

        if (savedData) {
          reset(savedData)
        }

        if (savedCountry) {
          setValue('country', savedCountry)
          setSelectedCountry(savedCountry)
        }

        if (savedShipping) {
          setValue('shipping', savedShipping)
          setSelectedShipping(savedShipping)
          const selectedMethod = shippingMethodsData.find(
            (method) => method.code === savedShipping,
          )
          if (selectedMethod && typeof onShippingChange === 'function') {
            onShippingChange(selectedMethod.price.incl_tax)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadSavedData()
  }, [reset, setValue, onShippingChange])

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target
      setValue(name, value, { shouldValidate: false })

      const currentData = getValues()
      saveToLocalStorage('shippingFormData', currentData)

      if (name === 'country') {
        setSelectedCountry(value)
        saveToLocalStorage('selectedCountry', value)
      }

      if (name === 'shipping') {
        setSelectedShipping(value)
        const selectedShippingMethod = shippingMethods.find(
          (method) => method.code === value,
        )
        if (selectedShippingMethod && typeof onShippingChange === 'function') {
          saveToLocalStorage('selectedShipping', value)
          onShippingChange(selectedShippingMethod.price.incl_tax)
        }
      }
    },
    [setValue, getValues, shippingMethods, onShippingChange],
  )

  const handleSubmit = useCallback(
    (data) => {
      if (typeof onSubmit === 'function') {
        onSubmit(data)
      }
    },
    [onSubmit],
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-8">
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
            label="Adresse complémentaire"
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
            value={selectedCountry}
            options={countries
              .filter((country) => country.is_shipping_country)
              .map((country) => ({
                value: country.url,
                label: country.printable_name,
                id: country.iso_3166_1_a3,
              }))}
            onChange={handleChange}
          />
          <GenericFormField
            name="shipping"
            label="Méthode d'Envoi"
            type="select"
            value={selectedShipping}
            options={shippingMethods.map((method) => ({
              value: method.code,
              label: `${method.name} ${method.price.currency} ${method.price.incl_tax}`,
            }))}
            onChange={handleChange}
          />
        </div>
      </form>
    </FormProvider>
  )
}

export default ShippingAddress
