import {Draft, PayloadAction} from "@reduxjs/toolkit";

/**
 * The base representation of a redux old state. Can be used as base class for any state
 * representations.
 */
export interface ApiState {
    /**
     * The error that occurred during the most recently failed request. Will be reset on the next
     * successful request.
     */
    error?: string;

    /**
     * The current loading state.
     */
    loading: boolean;

    /**
     * Whether the state is currently loading for the first time.
     */
    initialLoading: boolean;

    /**
     * The time the most recent successful request completed.
     */
    loadTime?: number;

    /**
     * The status code of the most recently completed request, whether it was successful or failed.
     */
    statusCode?: number;

    /**
     * The globally unique name of this state slice. Can not be changed.
     */
    readonly name: string;
}

/**
 * The representation of the payload of a "load failed" action.
 */
export interface LoadFailedPayload {
    /**
     * The error that occurred.
     */
    error: string;

    /**
     * The status code of the request.
     */
    statusCode: number;
}

/**
 * The base representation of the payload of a "load successful" action. Can be used as a base
 * class for any successful response payload.
 */
export interface LoadSuccessfulPayload {
    /**
     * The status code of the request.
     */
    statusCode: number;
}

/**
 * Constants used for creating the action names.
 */
export const LoadStarted = "LoadStarted";
export const LoadFailed = "LoadFailed";

/**
 * Processes a started request, sets the loading state to true, and clears the error.
 *
 * @param draft The current state
 */
export const reduceLoadStarted = (draft: Draft<ApiState>): void => {
    draft.loading = true;
    draft.error = undefined;

    if (!draft.statusCode) {
        draft.initialLoading = true;
    }
};

/**
 * Processes a failed request. Sets the loading state to false and saves error message and status
 * code.
 *
 * @param draft The current state
 * @param action The "load failed" action
 */
export const reduceLoadFailed = (
    draft: Draft<ApiState>, action: PayloadAction<LoadFailedPayload>
): void => {
    draft.loading = false;
    draft.initialLoading = false;
    draft.error = action.payload.error;
    draft.statusCode = action.payload.statusCode;
};
