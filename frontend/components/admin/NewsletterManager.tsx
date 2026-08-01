"use client";

import { useCallback, useEffect, useState } from 'react';
import {
  deleteSubscriber,
  getSubscribers,
  NewsletterSubscriber,
  setSubscriberActive,
} from '@/services/newsletterService';
import { getErrorMessage } from '@/services/apiClient';

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setSubscribers(await getSubscribers(localStorage.getItem('authToken') || ''));
      setError(null);
    } catch (cause: unknown) {
      setError(getErrorMessage(cause, 'Failed to load newsletter subscribers.'));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = async (subscriber: NewsletterSubscriber) => {
    try {
      const updated = await setSubscriberActive(
        subscriber.id,
        !subscriber.active,
        localStorage.getItem('authToken') || '',
      );
      setSubscribers(items => items.map(item => item.id === updated.id ? updated : item));
    } catch (cause: unknown) {
      setError(getErrorMessage(cause, 'Failed to update subscriber.'));
    }
  };

  const remove = async (subscriber: NewsletterSubscriber) => {
    if (!window.confirm(`Delete subscriber ${subscriber.email}?`)) return;
    try {
      await deleteSubscriber(subscriber.id, localStorage.getItem('authToken') || '');
      setSubscribers(items => items.filter(item => item.id !== subscriber.id));
    } catch (cause: unknown) {
      setError(getErrorMessage(cause, 'Failed to delete subscriber.'));
    }
  };

  return (
    <section className="mt-8 rounded-lg bg-gray-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Newsletter Subscribers</h2>
        <span className="text-sm text-gray-400">{subscribers.filter(item => item.active).length} active</span>
      </div>
      {error && <p className="mb-4 text-red-400">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400">
            <tr><th className="py-2">Email</th><th>Source</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {subscribers.map(subscriber => (
              <tr key={subscriber.id} className="border-t border-gray-700">
                <td className="py-3">{subscriber.email}</td>
                <td>{subscriber.source}</td>
                <td>{subscriber.active ? 'Active' : 'Inactive'}</td>
                <td className="space-x-2">
                  <button className="text-amber-300" onClick={() => void toggle(subscriber)}>
                    {subscriber.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="text-red-400" onClick={() => void remove(subscriber)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
