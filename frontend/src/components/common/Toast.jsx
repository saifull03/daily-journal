import React from "react";
import { useToastStore } from "../../store/toastStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm backdrop-blur-md transition-all duration-300 animate-slide-up ${
              isSuccess
                ? "bg-stone-900/95 text-stone-50 border-stone-800 dark:bg-stone-100 dark:text-stone-900"
                : isError
                  ? "bg-rose-900/95 text-white border-rose-800"
                  : "bg-stone-800/95 text-stone-100 border-stone-700"
            }`}
          >
            {isSuccess && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {isError && (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            {!isSuccess && !isError && (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            )}

            <span className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </span>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white dark:hover:text-stone-900 transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
