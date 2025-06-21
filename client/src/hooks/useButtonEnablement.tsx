// hooks/useButtonEnablement.ts
import { useEffect, useState } from "react";

type FormValues = Record<string, unknown>;
type FormErrors = Record<string, unknown>;

export function useButtonEnablement(
  values: FormValues,
  errors: FormErrors,
  requiredFields: string[]
): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;

    const allFieldsFilled = requiredFields.every((field) => {
      const value = values[field];
      return typeof value === "boolean" ? value : Boolean(value);
    });

    setEnabled(!hasErrors && allFieldsFilled);
  }, [errors, values, requiredFields]);

  return enabled;
}
