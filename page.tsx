'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface Prefix {
  id: number;
  name: string;
}

const MyH1: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Prefix[]>([]);
  const [name, setName] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function getData() {
    setLoading(true);
    setError("");
    try {
      const result = await axios.get("http://10.80.6.165:3000/prefixes");
      setData(result.data.data);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch prefixes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function insertData() {
    if (!name.trim()) {
      setError("Prefix name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post("http://10.80.6.165:3000/prefix", { name });
      setName("");
      getData();
    } catch (e) {
      console.error(e);
      setError("Failed to insert prefix. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function editData(id: number) {
    if (!editName.trim()) {
      setError("Prefix name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.put("http://10.80.6.165:3000/prefix", { id, name: editName });
      setEditId(null);
      getData();
    } catch (e) {
      console.error(e);
      setError("Failed to edit prefix. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteData(id: number) {
    setLoading(true);
    setError("");
    try {
      await axios.delete("http://10.80.6.165:3000/prefix", { data: { id } });
      getData();
    } catch (e) {
      console.error(e);
      setError("Failed to delete prefix. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function listData() {
    return data.map((item) => (
      <li key={item.id} className="flex items-center justify-between p-2 border-b">
        {editId === item.id ? (
          <>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border rounded p-1 flex-grow mr-2"
            />
            <button
              onClick={() => editData(item.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditId(null)}
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {item.name}
            <button
              onClick={() => {
                setEditId(item.id);
                setEditName(item.name);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Edit
            </button>
            <button
              onClick={() => deleteData(item.id)}
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Delete
            </button>
          </>
        )}
      </li>
    ));
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter prefix name"
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={insertData}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2 disabled:opacity-50"
        >
          Insert prefix
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="list-none p-0">{!loading && data.length > 0 ? listData() : null}</ul>
    </div>
  );
};

export default MyH1;
