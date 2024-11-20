// import React, {
//   createContext,
//   useState,
//   useContext,
//   useCallback,
//   useEffect,
// } from 'react'
// import { postPayment } from '../../services/api'

// const PaymentContext = createContext({
//   clientSecret: '',
//   dpmCheckerLink: '',
//   isLoading: false,
//   error: null,
//   updatePaymentInfo: () => {},
//   initializePayment: async () => {},
//   resetPayment: () => {},
// })

// export const PaymentProvider = ({ children }) => {
//   const [clientSecret, setClientSecret] = useState('')
//   const [dpmCheckerLink, setDpmCheckerLink] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const updatePaymentInfo = useCallback((paymentData) => {
//     setClientSecret(paymentData.clientSecret || '')
//     setDpmCheckerLink(paymentData.dpmCheckerLink || '')
//   }, [])

//   const initializePayment = useCallback(
//     async (paymentData) => {
//       // Validation des données d'entrée
//       if (!paymentData || !paymentData.amount || !paymentData.currency) {
//         const validationError = new Error('Données de paiement invalides')
//         setError(validationError)
//         throw validationError
//       }

//       try {
//         // Réinitialiser l'état avant la nouvelle requête
//         setIsLoading(true)
//         setError(null)

//         const response = await postPayment({
//           amount: paymentData.amount,
//           currency: paymentData.currency,
//         })

//         // Vérification de la réponse
//         if (!response.clientSecret) {
//           throw new Error('Aucun client secret reçu')
//         }

//         updatePaymentInfo({
//           clientSecret: response.clientSecret,
//           dpmCheckerLink: response.dpmCheckerLink,
//         })

//         return response
//       } catch (error) {
//         // Gestion détaillée des erreurs
//         console.error("Erreur lors de l'initialisation du paiement", error)

//         // Personnalisation du message d'erreur
//         const errorMessage =
//           error.response?.data?.message ||
//           error.message ||
//           'Erreur de paiement inconnue'

//         const formattedError = new Error(errorMessage)
//         setError(formattedError)

//         throw formattedError
//       } finally {
//         // Toujours arrêter le chargement
//         setIsLoading(false)
//       }
//     },
//     [updatePaymentInfo],
//   )

//   // Méthode pour réinitialiser le paiement
//   const resetPayment = useCallback(() => {
//     setClientSecret('')
//     setDpmCheckerLink('')
//     setIsLoading(false)
//     setError(null)
//   }, [])

//   // Mise à jour du contexte pour inclure les nouveaux états
//   return (
//     <PaymentContext.Provider
//       value={{
//         clientSecret,
//         dpmCheckerLink,
//         isLoading,
//         error,
//         updatePaymentInfo,
//         initializePayment,
//         resetPayment,
//       }}
//     >
//       {children}
//     </PaymentContext.Provider>
//   )
// }

// export const usePayment = () => {
//   const context = useContext(PaymentContext)
//   if (!context) {
//     throw new Error('usePayment must be used within a PaymentProvider')
//   }
//   return context
// }
