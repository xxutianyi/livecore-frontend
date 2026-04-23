import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/shadcn/input-group';
import { AnyFieldApi, useStore } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import { ComponentProps } from 'react';

type BaseFieldProps = {
    label?: string;
    placeholder?: string;
    fieldApi: AnyFieldApi;
};

type TextFieldProps = BaseFieldProps & ComponentProps<'input'>;

export function TextField({ label, placeholder, fieldApi, ...props }: TextFieldProps) {
    const errors = useStore(fieldApi.store, (state) => state.meta.errors);

    return (
        <Field>
            <FieldLabel htmlFor={fieldApi.name}>{label}</FieldLabel>
            <InputGroup>
                <InputGroupInput
                    aria-label={label}
                    id={fieldApi.name}
                    name={fieldApi.name}
                    value={fieldApi.state.value}
                    defaultValue={fieldApi.state.value}
                    onChange={(e) => fieldApi.setValue(e.target.value)}
                    placeholder={placeholder ?? '请输入'}
                    {...props}
                />
                {fieldApi.getMeta().isValidating && (
                    <InputGroupAddon align="inline-end">
                        <Loader2 className="animate-spin" />
                    </InputGroupAddon>
                )}
            </InputGroup>
            {fieldApi.state.meta.errors && <FieldError errors={fieldApi.state.meta.errors} />}
        </Field>
    );
}
