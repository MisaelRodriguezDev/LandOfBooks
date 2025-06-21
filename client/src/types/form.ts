import type { UUID } from "crypto";
import type { FieldError, FieldValues, Path, UseFormRegister, UseFormWatch } from "react-hook-form";
import type { ModuleCss } from "./component";

export interface FormGeneralProps {
  formTitle?: string;
  onSuccess?: () => void;
}

export interface UpdateFormProps<T> extends FormGeneralProps {
  prevData: T;
  id: UUID
}

export interface FormFieldProps<T extends FieldValues> extends ModuleCss {
  label: string;
  id: Path<T>;
  type: string;
  register: UseFormRegister<T>;
  error?: FieldError;
}

export interface TextAreaProps<T extends FieldValues> extends Omit<FormFieldProps<T>, "type"> {
  maxLength?: number
  watch?: UseFormWatch<T>
}

interface Options {
  value: string;
  label: string;
}

export interface SelectProps<T extends FieldValues> extends Omit<FormFieldProps<T>, "type"> {
  options: Options[];
}