import { ValidateErrors } from '@/service/response';

export function toFormError(error: any) {
    const fieldErrors: Record<string, any> = {};
    const errors = error.errors as ValidateErrors;
    Object.entries(errors).forEach(([field, errors]) => {
        fieldErrors[field] = errors.map((message) => ({ message }));
    });
    return { fields: fieldErrors };
}
