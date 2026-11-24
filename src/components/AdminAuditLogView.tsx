import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Trash2 } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  AuditLogRecord,
  listAuditLogs,
  softDeleteAuditLogs,
} from '../lib/supabaseApi';

const PAGE_SIZE = 50;

const ACTION_LABELS: Record<string, string> = {
  login_success: 'सफल लगइन',
  logout: 'लगआउट',
  account_created: 'खाता सिर्जना',
  created: 'सिर्जना',
  updated: 'परिवर्तन',
  deleted: 'हटाइयो',
  completed: 'पूरा',
  admin_user_created: 'प्रयोगकर्ता सिर्जना',
  admin_user_updated: 'प्रयोगकर्ता परिवर्तन',
  admin_user_deleted: 'प्रयोगकर्ता हटाइयो',
  audit_logs_soft_deleted: 'Audit log हटाइयो',
};

const ENTITY_LABELS: Record<string, string> = {
  authentication: 'लगइन',
  auth_user: 'प्रयोगकर्ता खाता',
  user: 'प्रयोगकर्ता',
  project: 'आयोजना',
  simulation_case_version: 'अभ्यास केस',
  simulation_attempt: 'अभ्यास प्रयास',
  simulation_answer: 'अभ्यास उत्तर',
  simulation_result: 'अभ्यास नतिजा',
  simulation_certificate: 'अभ्यास प्रमाणपत्र',
  audit_log: 'Audit log',
};

export const AdminAuditLogView: React.FC = () => {
  const [items, setItems] = useState<AuditLogRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setError('');
    void listAuditLogs(page, PAGE_SIZE, includeDeleted)
      .then((result) => {
        if (!isCurrent) return;
        setItems(result.items);
        setTotal(result.total);
        setSelectedIds([]);
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : 'Audit log लोड गर्न सकिएन।');
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [page, includeDeleted, reloadCount]);

  const activeItems = items.filter((item) => item.deleted_at === null);
  const allActiveSelected = activeItems.length > 0
    && activeItems.every((item) => selectedIds.includes(item.id));
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const toggleItem = (id: string) => {
    setSelectedIds((previous) => previous.includes(id)
      ? previous.filter((selectedId) => selectedId !== id)
      : [...previous, id]);
  };

  const togglePage = () => {
    setSelectedIds(allActiveSelected ? [] : activeItems.map((item) => item.id));
  };

  const archiveEntries = async (ids: string[]) => {
    if (ids.length === 0 || !window.confirm(`छानिएका ${ids.length} audit log हटाउने? हटाइएका प्रविष्टि पुनःस्थापना गर्न मिल्दैन।`)) {
      return;
    }
    setIsMutating(true);
    setError('');
    setNotice('');
    try {
      const deletedCount = await softDeleteAuditLogs(ids);
      setNotice(`${deletedCount} वटा audit log हटाइयो।`);
      setSelectedIds([]);
      setReloadCount((count) => count + 1);
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : 'Audit log हटाउन सकिएन।');
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <section className="space-y-5" aria-labelledby="audit-log-heading">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">प्रणाली व्यवस्थापन</p>
          <h1 id="audit-log-heading" className="mt-1 text-2xl font-bold text-slate-900">Audit log / audit trail</h1>
          <p className="mt-1 text-sm text-slate-600">
            लगइन, प्रयोगकर्ता, आयोजना र अभ्याससम्बन्धी गतिविधिको अभिलेख।
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReloadCount((count) => count + 1)}
          disabled={isLoading || isMutating}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} aria-hidden="true" />
          पुनः लोड
        </button>
      </header>

      {!isSupabaseConfigured && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          स्थानीय मोडमा audit log यही ब्राउजरमा मात्र भण्डारण हुन्छ; यसलाई server-side वा tamper-proof अभिलेख मान्न मिल्दैन।
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(event) => {
              setIncludeDeleted(event.target.checked);
              setPage(0);
              setSelectedIds([]);
              setNotice('');
            }}
            className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
          />
          पहिले हटाइएका प्रविष्टि पनि देखाउनुहोस्
        </label>
        <button
          type="button"
          onClick={() => void archiveEntries(selectedIds)}
          disabled={selectedIds.length === 0 || isMutating || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} aria-hidden="true" />
          छानिएका हटाउनुहोस् ({selectedIds.length})
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {notice}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm text-slate-600">
          <span>{total} वटा प्रविष्टि{includeDeleted ? ' (हटाइएकासहित)' : ''}</span>
          <span>{page + 1} / {pageCount} पृष्ठ</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="यस पृष्ठका सबै सक्रिय audit log छान्नुहोस्"
                    checked={allActiveSelected}
                    onChange={togglePage}
                    disabled={activeItems.length === 0 || isMutating}
                    className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                  />
                </th>
                <th scope="col" className="px-4 py-3">समय</th>
                <th scope="col" className="px-4 py-3">प्रयोगकर्ता</th>
                <th scope="col" className="px-4 py-3">कार्य</th>
                <th scope="col" className="px-4 py-3">विषय</th>
                <th scope="col" className="px-4 py-3">विवरण</th>
                <th scope="col" className="px-4 py-3">स्थिति</th>
                <th scope="col" className="px-4 py-3">कार्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">Audit log लोड हुँदैछ...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">देखाउन मिल्ने audit log छैन।</td></tr>
              ) : items.map((item) => {
                const isDeleted = item.deleted_at !== null;
                return (
                  <tr key={item.id} className={isDeleted ? 'bg-slate-50/70 text-slate-500' : 'text-slate-700'}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`${item.actor_username} को audit log छान्नुहोस्`}
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        disabled={isDeleted || isMutating}
                        className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {new Intl.DateTimeFormat('ne-NP', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.occurred_at))}
                    </td>
                    <td className="px-4 py-3 font-medium">{item.actor_username}</td>
                    <td className="px-4 py-3">{ACTION_LABELS[item.action] ?? item.action}</td>
                    <td className="max-w-48 px-4 py-3">
                      <span>{ENTITY_LABELS[item.entity_type] ?? item.entity_type}</span>
                      {item.entity_id && <span className="mt-1 block break-all text-xs text-slate-500">{item.entity_id}</span>}
                    </td>
                    <td className="max-w-72 px-4 py-3">
                      <pre className="max-h-24 overflow-auto whitespace-pre-wrap break-words font-sans text-xs">
                        {JSON.stringify(item.details)}
                      </pre>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {isDeleted ? `हटाइएको ${new Intl.DateTimeFormat('ne-NP', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.deleted_at!))}` : 'सक्रिय'}
                    </td>
                    <td className="px-4 py-3">
                      {!isDeleted && (
                        <button
                          type="button"
                          onClick={() => void archiveEntries([item.id])}
                          disabled={isMutating}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                          aria-label={`${item.actor_username} को audit log हटाउनुहोस्`}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          हटाउनुहोस्
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <footer className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={page === 0 || isLoading}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            अघिल्लो
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            disabled={page >= pageCount - 1 || isLoading}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            अर्को
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </footer>
      </div>
    </section>
  );
};
