import { Draft, PayloadAction } from "@reduxjs/toolkit";

export interface ApiState {
    error?: string;
    loading: boolean;
    initialLoading: boolean;
    loadTime?: number;
    statusCode?: number;
    readonly name: string;
}

export interface LoadFailedPayload {
    error: string;
    statusCode: number;
}

export interface LoadSuccessfulPayload {
    statusCode: number;
}

export const LoadStarted = "LoadStarted";
export const LoadFailed = "LoadFailed";

export const reduceLoadStarted = (draft: Draft<ApiState>): void => {
    draft.loading = true;
    draft.error = undefined;

    if (!draft.statusCode) {
        draft.initialLoading = true;
    }
};

export const reduceLoadFailed = (
    draft: Draft<ApiState>, action: PayloadAction<LoadFailedPayload>
): void => {
    draft.loading = false;
    draft.initialLoading = false;
    draft.error = action.payload.error;
    draft.statusCode = action.payload.statusCode;
};
