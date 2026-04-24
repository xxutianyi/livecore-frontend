'use client';

import { Button } from '@/components/shadcn/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { InputGroup, InputGroupAddon } from '@/components/shadcn/input-group';
import { useForm } from '@/components/winglab/form/use-form';
import { Eye, EyeClosed } from 'lucide-react';
import { ComponentProps, useState } from 'react';

type BaseFieldProps = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  formApi: ReturnType<typeof useForm>;
};

type TextFieldProps = BaseFieldProps & ComponentProps<'input'>;

export function TextField({
  name,
  label,
  description,
  placeholder,
  defaultValue,
  formApi,
  ...props
}: TextFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        aria-label={label}
        id={name}
        name={name}
        value={formApi.getFieldValue(name)}
        defaultValue={defaultValue}
        onChange={(e) => formApi.setFieldValue(name, e.target.value)}
        placeholder={placeholder ?? '请输入'}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {formApi.getFieldError(name) && <FieldError errors={formApi.getFieldError(name)} />}
    </Field>
  );
}

export function PasswordField({
  name,
  label,
  description,
  placeholder,
  defaultValue,
  formApi,
  ...props
}: TextFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <InputGroup>
        <Input
          aria-label={label}
          data-slot="input-group-control"
          className="border-none bg-transparent focus-visible:ring-0"
          id={name}
          name={name}
          value={formApi.getFieldValue(name)}
          defaultValue={defaultValue}
          onChange={(e) => formApi.setFieldValue(name, e.target.value)}
          placeholder={placeholder ?? '请输入'}
          type={visible ? 'text' : 'password'}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <Button variant="ghost" size="icon-sm" onClick={() => setVisible(!visible)}>
            {visible ? <Eye /> : <EyeClosed />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {formApi.getFieldError(name) && <FieldError errors={formApi.getFieldError(name)} />}
    </Field>
  );
}
