import React from "react";
import Modal from "./Modal";
import { IoWarningOutline } from "react-icons/io5";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action? This cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "danger", // 'danger' | 'warning' | 'info'
}) => {
  const typeColors = {
    danger: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white",
    info: "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20 text-white",
  };

  const iconColors = {
    danger: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    info: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 animate-scale-in">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border ${iconColors[type]} shrink-0`}>
            <IoWarningOutline className="text-2xl" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-slate-350 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-lg cursor-pointer ${typeColors[type]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
