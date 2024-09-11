import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello/')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching message:', error));
  }, []);

  return (
    <div className="App">
      <h1>Django React Vite Boilerplate</h1>
      <p>Message from API: {message}</p>
    </div>
  );
}

export default App;
