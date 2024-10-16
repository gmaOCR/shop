import { useState } from 'react'


const useLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
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
