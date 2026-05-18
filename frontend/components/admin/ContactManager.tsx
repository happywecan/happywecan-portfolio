"use client";

import { useEffect, useState } from 'react';
import { ContactItem, getContactsAdmin, updateContactStatus } from '@/services/contactService';

export default function ContactManager() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You are not authenticated. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getContactsAdmin(token);
      setContacts(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch contacts';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleToggleStatus = async (id: string, updates: { read?: boolean; replied?: boolean }) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You are not authenticated. Please log in again.');
      return;
    }

    try {
      const updated = await updateContactStatus(id, updates, token);
      setContacts((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update contact status';
      setError(message);
    }
  };

  if (loading && contacts.length === 0) {
    return <div className="text-center text-gray-400">Loading contacts...</div>;
  }

  return (
    <div className="mt-8 rounded-lg bg-gray-800/50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Manage Contacts</h3>
        <button
          onClick={fetchContacts}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      {error && <div className="my-4 rounded-md bg-red-900/20 p-3 text-center text-red-400">Error: {error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-700/50 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Read</th>
              <th className="px-6 py-3">Replied</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((item) => (
                <tr key={item.id} className="border-b border-gray-700 bg-gray-800 hover:bg-gray-700/50">
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(item.created_at).toLocaleString('zh-TW', { hour12: false })}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="max-w-lg px-6 py-4 whitespace-pre-wrap break-words">{item.message}</td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={item.read}
                      onChange={(event) => handleToggleStatus(item.id, { read: event.target.checked })}
                      className="h-5 w-5"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={item.replied}
                      onChange={(event) => handleToggleStatus(item.id, { replied: event.target.checked })}
                      className="h-5 w-5"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                  No contact messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
