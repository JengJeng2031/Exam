'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Prefix {
  id: number;
  label: string;
  description: string;
  status: string;
}

const MyH1: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Prefix[]>([]);
  const [label, setLabel] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Check if user is authenticated (token is present)
  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      router.push('/login'); // Redirect to login if not authenticated
    } else {
      getData();
    }
  }, []);

  async function getData() {
    setLoading(true);
    setError('');
    try {
      const result = await axios.get('https://66e3d100d2405277ed11ef3e.mockapi.io/api/todo', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Send the token in the request header
        },
      });
      setData(result.data);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* Render your table here */}
    </div>
  );
};

export default MyH1;
