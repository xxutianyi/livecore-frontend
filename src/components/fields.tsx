import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AnyFieldApi, useStore } from '@tanstack/react-form';

type BaseFieldProps = {
    label?: string;
    placeholder?: string;
    fieldApi: AnyFieldApi;
};

export function TextField({ label, placeholder, fieldApi }: BaseFieldProps) {
    const errors = useStore(fieldApi.store, (state) => state.meta.errors);

    return (
        <Field>
            <FieldLabel htmlFor={fieldApi.name}>{label}</FieldLabel>
            <Input
                aria-label={label}
                id={fieldApi.name}
                name={fieldApi.name}
                value={fieldApi.state.value}
                defaultValue={fieldApi.state.value}
                onChange={(e) => fieldApi.setValue(e.target.value)}
                placeholder={placeholder ?? '请输入'}
            />
            {errors && <FieldError errors={errors} />}
        </Field>
    );
}
