import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Full-width sidebar-style sign out. Calls logout API then navigates to /login.
 */
export default function SignOutButton({ className = "" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await logout();
      navigate("/login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors text-left border border-transparent hover:border-slate-200 dark:hover:border-slate-700 disabled:opacity-60 ${className}`}
    >
      <span className="material-symbols-outlined">logout</span>
      <span className="text-sm">Sign Out</span>
    </button>
  );
}
