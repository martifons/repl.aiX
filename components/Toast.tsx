'use client';

import { useToast as useToastContext } from '@/context/ToastContext';

const styles = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-[#0057FF] text-white',
};

export function ToastContainer() {
  const { toasts } = useToastContext();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-xl px-4 py-3 text-sm font-medium shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 animate-in ${styles[t.type ?? 'success']}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
