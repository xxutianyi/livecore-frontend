export type ValidateErrors = {
    [key: string]: string[];
};

export type ApiResponse<T = any> = {
    data?: T;
    code: number;
    message: string;
    errors?: ValidateErrors;
};
