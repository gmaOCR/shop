import React, { useEffect, useState, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartContext } from './context/CartContext'
import * as z from 'zod'
import { fetchCountries, fetchShippingMethods } from '../services/api'
import { GenericFormField } from './GenericFormField'

const formSchema = z.object({
  first_name: z.string().min(1, 'Le prénom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  guest_email: z.string().email("L'adresse e-mail est invalide"),
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

// Valeurs par défaut
const defaultValues = {
  first_name: '',
  last_name: '',
  guest_email: '',
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

export function ShippingAddress({ onShippingData, onShippingChange }) {
  const [countries, setCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [shippingMethods, setShippingMethods] = useState([])
  const [selectedShipping, setSelectedShipping] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const { cart } = useCartContext()

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const { setValue, getValues } = methods

  // Effet pour charger les pays et méthodes d'expédition
  useEffect(() => {
    const loadData = async () => {
      if (!cart) {
        setCountries([])
        setShippingMethods([])
        setIsLoading(false)
        returna
      }

      try {
        setIsLoading(true)

        // Chargement des pays et méthodes d'expédition
        const [loadedCountries, loadedShippingMethods] = await Promise.all([
          fetchCountries(cart),
          fetchShippingMethods(cart),
        ])

        setCountries(loadedCountries)
        setShippingMethods(loadedShippingMethods)

        // Restauration de la méthode d'expédition sauvegardée
        const savedShipping = localStorage.getItem('selectedShipping')
        if (
          savedShipping &&
          loadedShippingMethods.some((m) => m.code === savedShipping)
        ) {
          setValue('shipping', savedShipping)
          setSelectedShipping(savedShipping)

          // Mise à jour du coût de livraison si nécessaire
          const selectedMethod = loadedShippingMethods.find(
            (m) => m.code === savedShipping,
          )
          if (selectedMethod && typeof onShippingChange === 'function') {
            onShippingChange(selectedMethod.price.incl_tax)
          }
        }

        // Restauration du pays sauvegardé
        const savedCountry = localStorage.getItem('selectedCountry')
        if (
          savedCountry &&
          loadedCountries.some((c) => c.url === savedCountry)
        ) {
          setValue('country', savedCountry)
          setSelectedCountry(savedCountry)
        }

        // Restauration des autres données du formulaire
        const savedFormData = JSON.parse(
          localStorage.getItem('shippingFormData') || '{}',
        )
        Object.keys(savedFormData).forEach((key) => {
          if (key !== 'country' && key !== 'shipping') {
            setValue(key, savedFormData[key], { shouldValidate: false })
          }
        })
      } catch (error) {
        console.error('Erreur de chargement', error)
        setCountries([])
        setShippingMethods([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [cart])

  // Conservez vos fonctions de gestion de changement existantes
  const handleCountryChange = useCallback(
    (event) => {
      const { value } = event.target
      if (value !== selectedCountry) {
        setValue('country', value, { shouldValidate: false })
        setSelectedCountry(value)
        localStorage.setItem('selectedCountry', value)

        // Sauvegarde des données du formulaire
        const currentData = getValues()
        localStorage.setItem('shippingFormData', JSON.stringify(currentData))
      }
    },
    [setValue, getValues, selectedCountry],
  )

  const handleShippingChange = useCallback(
    (event) => {
      const { value } = event.target
      setValue('shipping', value, { shouldValidate: false })

      const selectedShippingMethod = shippingMethods.find(
        (method) => method.code === value,
      )

      if (selectedShippingMethod && typeof onShippingChange === 'function') {
        setSelectedShipping(value)
        localStorage.setItem('selectedShipping', value)
        onShippingChange(selectedShippingMethod.price.incl_tax)
      }

      // Sauvegarde des données du formulaire
      const currentData = getValues()
      localStorage.setItem('shippingFormData', JSON.stringify(currentData))
    },
    [setValue, shippingMethods, onShippingChange, getValues],
  )

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target

      if (name === 'country') {
        handleCountryChange(event)
      } else if (name === 'shipping') {
        handleShippingChange(event)
      } else {
        setValue(name, value, { shouldValidate: false })

        // Sauvegarde des données du formulaire
        const currentData = getValues()
        localStorage.setItem('shippingFormData', JSON.stringify(currentData))
      }
    },
    [setValue, getValues, handleCountryChange, handleShippingChange],
  )

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onShippingData)}
        className="space-y-8"
      >
        <>
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
            <GenericFormField
              name="guest_email"
              label="Email"
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
              options={
                shippingMethods.length > 0
                  ? shippingMethods.map((method) => ({
                      value: method.code,
                      label: `${method.name} ${method.price.currency} ${method.price.incl_tax}`,
                    }))
                  : []
              }
              onChange={handleChange}
            />
          </div>
        </>
      </form>
    </FormProvider>
  )
}

export default ShippingAddress
