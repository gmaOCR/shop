import { API_BASE_URL } from '../../services/api'
import { useState } from 'react'

const useLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return { username, password, error, handleSubmit, setUsername, setPassword }
}

export default useLogin
