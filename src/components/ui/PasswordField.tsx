"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { Input } from "./input";

type PasswordFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  register: any;
  error?: string;
};

export function PasswordField({
  label,
  name,
  placeholder,
  register,
  error,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label.includes("*") ? (
          <>
            {label.replace("*", "")}
            <span className="text-red-500">*</span>
          </>
        ) : (
          label
        )}
      </label>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`pr-10 ${error ? "border-red-500 focus:ring-red-500" : ""}`}
          {...register(name)}
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <EyeSlashIcon size={18} />
          ) : (
            <EyeIcon size={18} />
          )}
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
