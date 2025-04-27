
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

const FormInput = ({ 
  id, 
  label, 
  type, 
  placeholder, 
  value, 
  onChange, 
  error, 
  disabled = false,
  icon,
  rightElement
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {rightElement}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`${icon ? 'pl-10' : ''} ${error ? "border-red-500" : ""}`}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
