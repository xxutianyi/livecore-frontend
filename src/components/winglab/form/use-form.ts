import { useEffect, useState } from 'react';

type FormData = Record<string, any>;
type FormErrors<TData> = Record<keyof TData, string[] | undefined>;

type UseFormProps<TData> = {
  initialValues?: TData | null;
  onSubmit?: (values?: TData | null) => Promise<void>;
};

export function useForm<TData extends FormData = FormData>(props: UseFormProps<TData>) {
  const { initialValues, onSubmit } = props;

  const [values, setValues] = useState<TData | undefined | null>(initialValues);
  const [errors, setErrors] = useState<FormErrors<TData>>();

  function getFormValues() {
    return values;
  }

  function getFormErrors() {
    return errors;
  }

  function setFormValues(values: TData | any) {
    setValues(values);
  }

  function setFormErrors(errors: Record<keyof TData, string[] | undefined>) {
    setErrors(errors);
  }

  function getFieldValue(fieldName: keyof TData | string) {
    return getFormValues()?.[fieldName] ?? '';
  }

  function getFieldError(fieldName: keyof TData) {
    return getFormErrors()?.[fieldName]?.map?.((message) => ({ message }));
  }

  function setFieldValue<Key extends keyof TData>(fieldName: Key, value: TData[Key]) {
    setValues((prev) => ({ ...prev, [fieldName]: value }) as TData);
    if (getFieldError(fieldName)) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }) as FormErrors<TData>);
    }
  }

  function handleSubmit(e?: any) {
    e?.preventDefault();
    onSubmit?.(values);
  }

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  return {
    getFieldValue,
    getFieldError,
    setFieldValue,
    setFormValues,
    setFormErrors,
    handleSubmit,
  };
}
