import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;

  error?: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, id, type = "text", className, error, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full">
        <input
          id={id}
          type={inputType}
          placeholder=" "
          disabled={disabled}
          ref={ref}
          className={`peer w-full rounded-xl border-2 bg-white px-4 pt-6 pb-2 text-[15px] text-black focus:outline-none transition-all ${disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
            } ${error
              ? "border-red-500"
              : "border-gray-200 focus:border-gray-700"
            } ${isPassword ? "pr-12" : ""} ${className}`}
          {...props}
        />

        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 top-2 text-[14px] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[16px] peer-focus:top-2 peer-focus:text-[14px] ${error ? "text-red-500" : "text-gray-500 peer-focus:text-gray-700"
            }`}
        >
          {label}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[18px] text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
