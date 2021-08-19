import {Dispatch} from "@reduxjs/toolkit";
import helpers from "../../constants/Functions";
import {HANDLEDERROR, SHARED_ARTIFACTS, SHARED_REPOS, SUCCESS, SYNC_STATUS_SHARED} from "../../constants/Constants";
import {handleError} from "./errorAction";
import {ActionType} from "./actions";
import {ShareApi, ShareWithRepositoryTO, ShareWithRepositoryTORoleEnum} from "../../api";

export const getSharedArtifacts = (repositoryId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const shareController = new ShareApi();
        try {
            const config = helpers.getClientConfig();
            const response = await shareController.getSharedArtifacts(repositoryId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SHARED_ARTIFACTS, sharedArtifacts: response.data})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_SHARED_ARTIFACTS, [repositoryId]));
        }
    };
};


export const getAllSharedArtifacts = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const shareController = new ShareApi();
        try {
            const config = helpers.getClientConfig();
            const response = await shareController.getAllSharedArtifacts(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SHARED_ARTIFACTS, sharedArtifacts: response.data})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_ALL_SHARED_ARTIFACTS, []));
        }
    };
};

export const unshareArtifact = (artifactId: string, repositoryId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const shareController = new ShareApi();
        try {
            const config = helpers.getClientConfig();
            const response = await shareController.unshareArtifactWithRepository(artifactId, repositoryId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "share.removed" });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.SHARE_WITH_REPO, [artifactId, repositoryId]));
        }
    };
};

export const shareWithRepo = (artifactId: string, repositoryId: string, role: ShareWithRepositoryTORoleEnum) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const shareController = new ShareApi();
        try {
            const shareWithRepositoryTO: ShareWithRepositoryTO = {
                artifactId,
                repositoryId,
                role
            }
            const config = helpers.getClientConfig();
            const response = await shareController.shareWithRepository(shareWithRepositoryTO, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "share.successful" });
                dispatch({type: SYNC_STATUS_SHARED, sharedSynced: false})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.SHARE_WITH_REPO, [artifactId, repositoryId, role]));
        }
    };
};

export const getSharedRepos = (artifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const shareController = new ShareApi();
        try {
            const config = helpers.getClientConfig();
            const response = await shareController.getSharedRepositories(artifactId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SHARED_REPOS, sharedRepos: response.data});
                dispatch({type: SYNC_STATUS_SHARED, sharedSynced: true})

            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_MANAGEABLE_REPOS, [artifactId]));
        }
    };
};