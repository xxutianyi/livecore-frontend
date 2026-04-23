'use client';

import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { useForm } from '@/components/winglab/form/use-form';
import { ComponentProps } from 'react';

type BaseFieldProps = {
    name: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    formApi: ReturnType<typeof useForm>;
};

type TextFieldProps = BaseFieldProps & ComponentProps<'input'>;

export function TextField({
    name,
    label,
    defaultValue,
    placeholder,
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
            {formApi.getFieldError(name) && <FieldError errors={formApi.getFieldError(name)} />}
        </Field>
    );
}
