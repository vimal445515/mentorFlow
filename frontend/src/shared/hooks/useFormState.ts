import { useState, useCallback, type ChangeEvent, type FormEvent } from "react";

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;
export type ValidatorFn<T> = (values: T) => ValidationErrors<T>;

/**
 * Reusable form state hook for handling values, validation, and submission
 */
export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  validator?: ValidatorFn<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (validator) {
          const nextErrors = validator(next);
          setErrors((prevErr) => ({ ...prevErr, [field]: nextErrors[field] }));
        }
        return next;
      });
    },
    [validator],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      setFieldValue(name as keyof T, finalValue);
    },
    [setFieldValue],
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (validator) {
        const currentErrors = validator(values);
        setErrors((prevErr) => ({ ...prevErr, [field]: currentErrors[field] }));
      }
    },
    [validator, values],
  );

  const setFieldError = useCallback((field: keyof T, error?: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const resetForm = useCallback(
    (newValues?: Partial<T>) => {
      setValues(newValues ? { ...initialValues, ...newValues } : initialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues],
  );

  const validateForm = useCallback((): boolean => {
    if (!validator) return true;
    const validationErrors = validator(values);
    setErrors(validationErrors);

    const touchedAll: Partial<Record<keyof T, boolean>> = {};
    for (const key of Object.keys(values)) {
      touchedAll[key as keyof T] = true;
    }
    setTouched(touchedAll);

    return Object.keys(validationErrors).length === 0;
  }, [validator, values]);

  const handleSubmit = useCallback(
    (onSubmit: (formValues: T) => Promise<void> | void) => {
      return async (e?: FormEvent) => {
        if (e && e.preventDefault) {
          e.preventDefault();
        }

        if (validator) {
          const isValid = validateForm();
          if (!isValid) return;
        }

        try {
          setIsSubmitting(true);
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [validateForm, validator, values],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setErrors,
    resetForm,
    validateForm,
    handleSubmit,
  };
}
