import {
    ActionCreatorWithoutPayload,
    ActionCreatorWithPayload,
    createSlice,
    Draft,
    PayloadAction,
    SliceCaseReducers
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { hasFailed, transformAxiosResponse } from "../../util/ApiUtils";
import type { RootDispatch, RootState } from "../Store";
import {
    ApiState,
    LoadFailed,
    LoadFailedPayload,
    LoadStarted,
    LoadSuccessfulPayload,
    reduceLoadFailed,
    reduceLoadStarted
} from "./ApiState";

export interface ListApiState<IdKey extends keyof Type, Type> extends ApiState {
    readonly value: Type[] | undefined;
    readonly key: IdKey;
}

export interface ListLoadSuccessfulPayload<Type> extends LoadSuccessfulPayload {
    value: Type[];
}

export interface ListUpdateStatePayload<IdKey extends keyof Type, Type> {
    update?: Type[];
    delete?: Type[IdKey][];
    replace?: boolean;
    readonly key: IdKey;
}

const ListLoadSucceeded = "ListLoadSucceeded";
const ListUpdateState = "ListUpdateState";

const createInitialListApiState = <IdKey extends keyof Type, Type>(
    idKey: IdKey,
    name: string
): ListApiState<IdKey, Type> => ({
    initialLoading: false,
    loading: false,
    name: name,
    key: idKey,
    value: undefined
});

const reduceListLoadSucceeded = <IdKey extends keyof Type, Type>(
    draft: Draft<ListApiState<IdKey, Type>>,
    action: PayloadAction<ListLoadSuccessfulPayload<Type>>
) => {
    draft.loading = false;
    draft.initialLoading = false;
    draft.statusCode = action.payload.statusCode;
    draft.loadTime = new Date().getTime();
    draft.error = undefined;
    draft.value = action.payload.value as Draft<Type[]>;
};

const reduceListUpdateState = <IdKey extends keyof Type, Type>(
    draft: Draft<ListApiState<IdKey, Type>>,
    action: PayloadAction<ListUpdateStatePayload<IdKey, Type>>
) => {
    const remove: Type[IdKey][] = [];
    if (action.payload.replace) {
        remove.push(...draft.value?.map(entry => (entry as Type)[action.payload.key]) || []);
    } else {
        remove.push(...action.payload.delete || []);
        remove.push(...action.payload.update?.map(entry => entry[action.payload.key]) || []);
    }
    draft.value = [...(draft.value || [])]
        .filter(entry => remove.indexOf((entry as Type)[action.payload.key]) === -1)
        .concat((action.payload.update || []) as Draft<Type>[])
        .sort((a, b) => {
            const attributeA = (a as Type)[action.payload.key];
            const attributeB = (b as Type)[action.payload.key];
            if (attributeA > attributeB) {
                return 1;
            }
            if (attributeA < attributeB) {
                return -1;
            }
            return 0;
        });
};

const getListSliceState = <IdKey extends keyof Type, Type>(
    state: RootState,
    sliceName: string
): ListApiState<IdKey, Type> | undefined => {
    return Object.values(state).find(slice => slice?.name === sliceName) as
        ListApiState<IdKey, Type> | undefined;
};

declare type ListOptions<IdKey extends keyof Type, Type> = {
    name: string,
    idKey: IdKey,
    cacheTimeout: number,
    execute: () => Promise<AxiosResponse<Type[]>>
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createListApiState = <IdKey extends keyof Type, Type>(
    options: ListOptions<IdKey, Type>
) => {
    const loadStartedAction = options.name + LoadStarted;
    const loadFailedAction = options.name + LoadFailed;
    const loadSucceededAction = options.name + ListLoadSucceeded;
    const updateStateAction = options.name + ListUpdateState;

    const InitialState = createInitialListApiState(options.idKey, options.name) as
        ListApiState<IdKey, Type>;

    const slice = createSlice<ListApiState<IdKey, Type>, SliceCaseReducers<ListApiState<IdKey, Type>>, typeof options.name>({
        name: options.name,
        initialState: InitialState,
        reducers: {
            [loadStartedAction]: reduceLoadStarted,
            [loadFailedAction]: reduceLoadFailed,
            [loadSucceededAction]: reduceListLoadSucceeded,
            [updateStateAction]: reduceListUpdateState
        }
    });

    // TODO Why does this not work?
    const loadStarted = slice.actions[loadStartedAction] as
        unknown as ActionCreatorWithoutPayload;

    const loadFailed = slice.actions[loadFailedAction] as
        ActionCreatorWithPayload<LoadFailedPayload>;

    const loadSucceeded = slice.actions[loadSucceededAction] as
        ActionCreatorWithPayload<ListLoadSuccessfulPayload<Type>>;

    const updateState = slice.actions[updateStateAction] as
        unknown as ActionCreatorWithPayload<ListUpdateStatePayload<IdKey, Type>>;

    const load = (forceLoad = false) => async (
        dispatch: RootDispatch,
        getState: () => RootState
    ) => {
        const storeState = getState();
        const state = getListSliceState<IdKey, Type>(storeState, options.name);

        if (!state) {
            throw new Error(`The list slice with name ${options.name} does not exist! Did you `
                + "you forget to add it to the root store?");
        }

        if (!forceLoad) {
            const loadTime = state.loadTime || 0;
            const maxAge = new Date().getTime() - options.cacheTimeout * 1000;
            if (loadTime > maxAge) {
                return;
            }
        }

        if (state.loading) {
            return;
        }

        dispatch(loadStarted());
        try {
            const result = transformAxiosResponse(await options.execute());
            if (hasFailed(result)) {
                dispatch(loadFailed({
                    error: result.error,
                    statusCode: result.status
                }));
            } else {
                dispatch(loadSucceeded({
                    value: result.result,
                    statusCode: result.status
                }));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            dispatch(loadFailed({
                error: error.message,
                statusCode: 0
            }));
        }
    };

    return [slice, load, updateState] as [typeof slice, typeof load, typeof updateState];
};

export default createListApiState;
