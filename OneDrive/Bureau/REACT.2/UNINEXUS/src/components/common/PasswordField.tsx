import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ label, className = "", ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
      <input {...props} type={visible ? "text" : "password"} className={`pr-11 ${className}`} />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 bottom-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
};
