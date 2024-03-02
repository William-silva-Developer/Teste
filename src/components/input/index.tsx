import React from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface IInputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

//<InputHTMLAttributes<HTMLInputElement>>
const Input: React.FC<IInputProps> = ({
  name,
  placeholder,
  register,
  rules,
  type,
  error,
  ...rest
}) => {
  return (
    <div>
      <input
        className="w-full border-2 rounded-md h-11 px-2 outline-blue-300"
        placeholder={placeholder}
        id={name}
        type={type}
        {...register(name, rules)}
        {...rest}
      />
      {error && <p className="my-1 text-red-500">{error}</p>}
    </div>
  );
};

export { Input };
