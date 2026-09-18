'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/toastSlice';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const toasts = useSelector((state) => state.toast.toasts);
  const dispatch = useDispatch();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-sport-cyan shrink-0" />
        };

        const bgColors = {
          success: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100',
          error: 'border-red-500/30 bg-red-950/90 text-red-100',
          warning: 'border-amber-500/30 bg-amber-950/90 text-amber-100',
          info: 'border-navy-600 bg-navy-900/95 text-white'
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border ${bgColors[t.type] || bgColors.info} animate-in slide-in-from-top-5 duration-300 transition-all`}
          >
            {icons[t.type] || icons.info}
            <div className="flex-1 min-w-0">
              {t.title && <h5 className="font-bold text-sm leading-tight text-white mb-0.5">{t.title}</h5>}
              <p className="text-xs text-slate-300 leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => dispatch(removeToast(t.id))}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
