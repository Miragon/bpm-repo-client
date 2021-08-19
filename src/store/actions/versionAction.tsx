import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {ArtifactVersionUploadTO, ArtifactVersionUploadTOSaveTypeEnum} from "../../api";
import helpers from "../../constants/Functions";
import {ACTIVE_VERSIONS, HANDLEDERROR, LATEST_VERSION, SUCCESS, SYNC_STATUS_VERSION} from "../../constants/Constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const createVersion = (artifactId: string, file: string, saveType: ArtifactVersionUploadTOSaveTypeEnum, comment?: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const versionController = new api.VersionApi();
        try {
            const artifactVersionUploadTO: ArtifactVersionUploadTO = {
                xml: file,
                versionComment: comment,
                saveType: saveType
            };
            const config = helpers.getClientConfig();
            const response = await versionController.createVersion(artifactId, artifactVersionUploadTO, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "version.created" });
                dispatch({ type: SYNC_STATUS_VERSION, dataSynced: false });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_VERSION, [artifactId, file, saveType, comment]));
        }
    };
};

export const getAllVersions = (artifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const versionController = new api.VersionApi();
            const config = helpers.getClientConfig();
            const response = await versionController.getAllVersions(artifactId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ACTIVE_VERSIONS, activeVersions: response.data });
                dispatch({type: SYNC_STATUS_VERSION, dataSynced: true});
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_ALL_VERSIONS, [artifactId]));
        }
    };
};

export const getLatestVersion = (artifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const versionController = new api.VersionApi();
            const config = helpers.getClientConfig();
            const response = await versionController.getLatestVersion(artifactId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: LATEST_VERSION, latestVersion: response.data });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.LATEST_VERSION, [artifactId]));
        }
    };
};

export const downloadVersion = (artifactId: string, bpmnArtifactVersionId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const versionController = new api.VersionApi();
            const config = helpers.getClientConfig();
            const response = await versionController.downloadVersion(artifactId, bpmnArtifactVersionId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "version.downloading" });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.LATEST_VERSION, [artifactId]));
        }
    };
};