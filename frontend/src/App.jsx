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
    <div className="flex flex-col items-center h-[100vh] justify-center">
      <h1 className=" rounded-lg p-3 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-red-500 via-green-500 my-3">Django React Vite Tailwind Boilerplate</h1>
      <h2>Message from API: <span className="text-pink-600">{message}</span></h2>
    </div>
  );
}

export default App;
