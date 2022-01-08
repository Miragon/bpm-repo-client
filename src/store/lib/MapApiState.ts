import {
    ActionCreatorWithPayload,
    createSlice,
    Draft,
    PayloadAction,
    SliceCaseReducers
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { hasFailed, transformAxiosResponse } from "../../util/ApiUtils";
import type { RootDispatch, RootState } from "../Store";
import { LoadFailedPayload, LoadSuccessfulPayload } from "./ApiState";
import { ObjectApiState } from "./ObjectApiState";

export interface MapApiState<Type> {
    readonly name: string;
    readonly values: { [key: string]: Omit<ObjectApiState<Type>, "name"> }
}

export interface MapLoadStartedPayload {
    id: string;
}

export interface MapLoadFailedPayload extends LoadFailedPayload {
    id: string;
}

export interface MapLoadSuccessfulPayload<Type> extends LoadSuccessfulPayload {
    id: string;
    value: Type;
}

export interface MapUpdateStatePayload<Type> {
    update?: {
        id: string,
        value: Type
    }[];
}

const MapLoadStarted = "MapLoadStarted";
const MapLoadFailed = "MapLoadFailed";
const MapLoadSucceeded = "MapLoadSucceeded";
const MapUpdateState = "MapUpdateState";

const createInitialMapApiState = <Type>(name: string): MapApiState<Type> => ({
    name: name,
    values: {}
});

const reduceMapLoadStarted = <Type>(
    draft: Draft<MapApiState<Type>>,
    action: PayloadAction<MapLoadStartedPayload>
): void => {
    const oldValue = draft.values[action.payload.id] || {
        error: undefined,
        loading: false,
        initialLoading: false,
        statusCode: 0,
        loadTime: 0,
        value: undefined
    };
    draft.values[action.payload.id] = {
        ...oldValue,
        loading: true,
        initialLoading: !oldValue.statusCode,
        error: undefined
    };
};

const reduceMapLoadFailed = <Type>(
    draft: Draft<MapApiState<Type>>,
    action: PayloadAction<MapLoadFailedPayload>
): void => {
    const oldValue = draft.values[action.payload.id] || {
        error: undefined,
        loading: false,
        initialLoading: false,
        statusCode: 0,
        loadTime: 0,
        value: undefined
    };
    draft.values[action.payload.id] = {
        ...oldValue,
        loading: false,
        initialLoading: false,
        error: action.payload.error,
        statusCode: action.payload.statusCode
    };
};

const reduceMapLoadSucceeded = <Type>(
    draft: Draft<MapApiState<Type>>,
    action: PayloadAction<MapLoadSuccessfulPayload<Type>>
) => {
    draft.values[action.payload.id] = {
        error: undefined,
        loading: false,
        initialLoading: false,
        statusCode: action.payload.statusCode,
        loadTime: new Date().getTime(),
        value: action.payload.value as Draft<Type>
    };
};

const reduceMapUpdateState = <Type>(
    draft: Draft<MapApiState<Type>>,
    action: PayloadAction<MapUpdateStatePayload<Type>>
) => {
    action.payload.update?.forEach(value => {
        draft.values[value.id] = {
            ...(draft.values[value.id] || {
                error: undefined,
                loading: false,
                initialLoading: false,
                statusCode: 0,
                loadTime: 0
            }),
            value: value.value as Draft<Type>
        };
    });
};

const getMapSliceState = <Type>(
    state: RootState,
    sliceName: string
): MapApiState<Type> | undefined => {
    return Object.values(state).find(slice => slice?.name === sliceName) as
        MapApiState<Type> | undefined;
};

declare type MapOptions<Type> = {
    name: string,
    cacheTimeout: number,
    execute: (id: string) => Promise<AxiosResponse<Type>>
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createMapApiState = <Type>(options: MapOptions<Type>) => {
    const loadStartedAction = options.name + MapLoadStarted;
    const loadFailedAction = options.name + MapLoadFailed;
    const loadSucceededAction = options.name + MapLoadSucceeded;
    const updateStateAction = options.name + MapUpdateState;

    const slice = createSlice<MapApiState<Type>, SliceCaseReducers<MapApiState<Type>>, typeof options.name>({
        name: options.name,
        initialState: createInitialMapApiState(options.name) as MapApiState<Type>,
        reducers: {
            [loadStartedAction]: reduceMapLoadStarted,
            [loadFailedAction]: reduceMapLoadFailed,
            [loadSucceededAction]: reduceMapLoadSucceeded,
            [updateStateAction]: reduceMapUpdateState
        }
    });

    const loadStarted = slice.actions[loadStartedAction] as
        ActionCreatorWithPayload<MapLoadStartedPayload>;

    const loadFailed = slice.actions[loadFailedAction] as
        ActionCreatorWithPayload<MapLoadFailedPayload>;

    const loadSucceeded = slice.actions[loadSucceededAction] as
        ActionCreatorWithPayload<MapLoadSuccessfulPayload<Type>>;

    const updateState = slice.actions[updateStateAction] as
        ActionCreatorWithPayload<MapUpdateStatePayload<Type>>;

    const load = (id: string, forceLoad = false) => async (
        dispatch: RootDispatch,
        getState: () => RootState
    ) => {
        const state = getMapSliceState<Type>(getState(), options.name);

        if (!state) {
            throw new Error(`The list slice with name ${options.name} does not exist! Did you `
                + "you forget to add it to the root store?");
        }

        const stateEntry = state.values[id];

        if (!forceLoad) {
            const loadTime = stateEntry?.loadTime || 0;
            const maxAge = new Date().getTime() - options.cacheTimeout * 1000;
            if (loadTime > maxAge) {
                return;
            }

            if (stateEntry?.loading) {
                return;
            }
        }

        dispatch(loadStarted({ id }));
        try {
            const result = transformAxiosResponse(await options.execute(id));
            if (hasFailed(result)) {
                dispatch(loadFailed({
                    id: id,
                    error: result.error,
                    statusCode: result.status
                }));
            } else {
                dispatch(loadSucceeded({
                    id: id,
                    value: result.result,
                    statusCode: result.status
                }));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            dispatch(loadFailed({
                id: id,
                error: error.message,
                statusCode: 0
            }));
        }
    };

    return [slice, load, updateState] as [typeof slice, typeof load, typeof updateState];
};

export default createMapApiState;
