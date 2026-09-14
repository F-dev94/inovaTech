import React from 'react';
import { useTrocaJaStore } from '../../services/store';
import { Bell, X, CheckCircle2, AlertTriangle, Info, DollarSign } from 'lucide-react';

export default function NotificationToast() {
  const { state, actions } = useTrocaJaStore();

  if (!state.notifications || state.notifications.length === 0) return null;

  // Show top 3 recent notifications
  const recentNotifs = state.notifications.slice(0, 3);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
      {recentNotifs.map((notif) => {
        let icon = <Info className="w-5 h-5 text-indigo-400" />;
        let borderClass = 'border-indigo-500/40 bg-slate-900/95';

        if (notif.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
          borderClass = 'border-emerald-500/50 bg-slate-900/95';
        } else if (notif.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />;
          borderClass = 'border-amber-500/50 bg-slate-950/95';
        } else if (notif.type === 'financial') {
          icon = <DollarSign className="w-5 h-5 text-emerald-300" />;
          borderClass = 'border-emerald-400/50 bg-slate-900/95';
        }

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border ${borderClass} shadow-2xl backdrop-blur-md flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300`}
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-white text-xs truncate">{notif.title}</h4>
                <button
                  onClick={() => actions.dismissNotification(notif.id)}
                  className="text-gray-500 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-gray-300 text-[11px] leading-snug mt-0.5">{notif.message}</p>
              <span className="text-[9px] text-gray-500 block mt-1">{notif.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
