import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {NewRepositoryTO, RepositoryUpdateTO} from "../../api/models";
import helpers from "../../constants/Functions";
import {
    ACTIVE_REPO,
    GET_REPOS,
    SUCCESS,
    SYNC_STATUS_ACTIVE_REPOSITORY,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY,
    UNHANDLEDERROR
} from "../constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const fetchRepositories = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        // config was passed before
        const repositoryController = new api.RepositoryApi();
        try {
            const config = helpers.getClientConfig();

            const response = await repositoryController.getAllRepositories(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: GET_REPOS, repos: response.data });
                dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: true });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_REPOSITORIES, []));
        }
    };
};

export const getSingleRepository = (id: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const repositoryController = new api.RepositoryApi();
        try {
            const config = helpers.getClientConfig();
            const response = await repositoryController.getSingleRepository(id, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ACTIVE_REPO, activeRepo: response.data });
                dispatch({type: SYNC_STATUS_ACTIVE_REPOSITORY, dataSynced: true})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_SINGLE_REPOSITORY, [id]));
        }
    };
};

export const createRepository = (name: string, description: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        // config was passed before
        const repositoryController = new api.RepositoryApi();
        try {
            const newRepositoryTO: NewRepositoryTO = {
                name,
                description
            };
            const config = helpers.getClientConfig();
            const response = await repositoryController.createRepository(newRepositoryTO, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "repository.created" });
                dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            console.log(error.response)
            console.log(error.response.data)
            console.log("in catch")
            dispatch(handleError(error, ActionType.CREATE_REPOSITORY, [name, description]));
        }
    };
};

export const updateRepository = (id: string, name: string, description: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const repositoryController = new api.RepositoryApi();
        try {
            const repositoryUpdateTO: RepositoryUpdateTO = {
                name,
                description
            };
            const config = helpers.getClientConfig();
            const response = await repositoryController
                .updateRepository(repositoryUpdateTO, id, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "repository.updated" });
                dispatch({ type: SYNC_STATUS_ACTIVE_REPOSITORY, dataSynced: false });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.UPDATE_REPOSITORY, [id, name, description]));
        }
    };
};

export const deleteRepository = (id: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        // config was passed before
        const repositoryController = new api.RepositoryApi();
        try {
            const config = helpers.getClientConfig();
            const response = await repositoryController.deleteRepository(id, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "repository.deleted" });
                dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})

            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.DELETE_REPOSITORY, [id]));
        }
    };
};
