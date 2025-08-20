import React from "react";

type InputVariant = "primary";

interface InputProps {
  variant?: InputVariant;
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search";
  placeholder?: string;
  value?: string;
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}

export default function Input({
  variant = "primary",
  type = "text",
  placeholder,
  value,
  label,
  onChange,
  onBlur,
  onFocus,
}: InputProps) {
  const baseStyles = "py-2 px-4 rounded-md transition w-full";

  const variantStyles: Record<InputVariant, string> = {
    primary: "bg-primary-fill outline-gray-stroke text-gray-text",
  };

  return (
    <div>
      {label && <label className="block text-white">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className={`${baseStyles} ${variantStyles[variant]}`}
      />
    </div>
  );
}
