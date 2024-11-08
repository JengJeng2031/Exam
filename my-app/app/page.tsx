'use client';

import { useEffect, useState } from "react";
import axios from "axios";
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
  const [label, setLabel] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("");

  const [error, setError] = useState<string>("");
  const router = useRouter();

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
      const result = await axios.get('https://66e3d100d2405277ed11ef3e.mockapi.io/api/todo');
      setData(result.data);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function insertData() {
    if (!label.trim() || !description.trim() || !status.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await axios.post("https://66e3d100d2405277ed11ef3e.mockapi.io/api/todo", { label, description, status });
      setData([...data, { id: result.data.id, label, description, status }]);
      setLabel("");
      setDescription("");
      setStatus("");
    } catch (e) {
      console.error(e);
      setError("Failed to insert data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function editData(id: number) {
    if (!editLabel.trim() || !editDescription.trim() || !editStatus.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.put(`https://66e3d100d2405277ed11ef3e.mockapi.io/api/todo/${id}`, {
        label: editLabel,
        description: editDescription,
        status: editStatus,
      });
      setData(data.map((item) => (item.id === id ? { ...item, label: editLabel, description: editDescription, status: editStatus } : item)));
      setEditId(null);
    } catch (e) {
      console.error(e);
      setError("Failed to edit data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteData(id: number) {
    setLoading(true);
    setError("");
    try {
      await axios.delete(`https://66e3d100d2405277ed11ef3e.mockapi.io/api/todo/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (e) {
      console.error(e);
      setError("Failed to delete data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function renderTableRows() {
    return data.map((item) => (
      <tr key={item.id} className="bg-gradient-to-r from-indigo-100 to-indigo-300">
        {editId === item.id ? (
          <>
            <td><input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="Edit label"
              className="border rounded p-2 w-full bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            /></td>
            <td><input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Edit description"
              className="border rounded p-2 w-full bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            /></td>
            <td><input
              type="text"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              placeholder="Edit status"
              className="border rounded p-2 w-full bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            /></td>
            <td>
              <button onClick={() => editData(item.id)} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition">Save</button>
              <button onClick={() => setEditId(null)} className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600 transition">Cancel</button>
            </td>
          </>
        ) : (
          <>
            <td className="p-4 text-gray-700 font-semibold">{item.label}</td>
            <td className="p-4 text-gray-700 font-semibold">{item.description}</td>
            <td className="p-4 text-gray-700 font-semibold">{item.status}</td>
            <td>
              <button onClick={() => { setEditId(item.id); setEditLabel(item.label); setEditDescription(item.description); setEditStatus(item.status); }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Edit</button>
              <button onClick={() => deleteData(item.id)} className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600 transition">Delete</button>
            </td>
          </>
        )}
      </tr>
    ));
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter label"
          className="border p-2 flex-grow rounded bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="border p-2 flex-grow rounded bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Enter status"
          className="border p-2 flex-grow rounded bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={insertData}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded shadow-lg hover:from-blue-600 hover:to-indigo-600 transition disabled:opacity-50"
        >
          Insert
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <th className="p-4">Label</th>
            <th className="p-4">Description</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>{!loading && data.length > 0 ? renderTableRows() : null}</tbody>
      </table>
    </div>
  );
};

export default MyH1;
