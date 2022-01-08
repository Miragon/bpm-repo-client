import { AxiosError, AxiosResponse } from "axios";
import { BaseAPI } from "../api/base";

export declare type BaseResponse = {
    /**
     * The status code of the last request.
     */
    status: number;
};

/**
 * Represents the successful response type, containing the result.
 */
export declare type SuccessfulResponse<T> = BaseResponse & {
    /**
     * The response body. Undefined if an error occurred.
     */
    result: T;
};

/**
 * Represents the failed response type, containing the error.
 */
export declare type FailedResponse = BaseResponse & {
    /**
     * The error message of the last request. Undefined if no error occurred.
     */
    error: string;
};

/**
 * Represents a server response. Can be either successful or failed.
 */
export declare type ApiResponse<T> = SuccessfulResponse<T> | FailedResponse;

/**
 * Checks if the passed response is a failed one.
 *
 * @param response The response to check
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasFailed = (response: ApiResponse<any>): response is FailedResponse => {
    return !!(response as FailedResponse).error;
};

export const apiExec = async <API extends BaseAPI, T>(
    Api: new () => API,
    execute: (api: API) => Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> => {
    try {
        const response = await execute(new Api());
        return transformAxiosResponse(response);
    } catch (error) {
        return transformAxiosError(error as AxiosError<T>);
    }
};

export const transformAxiosResponse = <T>(response: AxiosResponse<T>): ApiResponse<T> => {
    if (Math.floor(response.status / 100) === 2) {
        return {
            result: response.data,
            status: response.status
        };
    }

    return {
        status: response.status,
        error: response.statusText
    };
};

export const transformAxiosError = <T>(error: AxiosError<T>): ApiResponse<T> => {
    return {
        status: error.response?.status ?? -1,
        error: String(error.response?.data) ?? error.message
    };
};
