import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {ArtifactVersionUploadTO, ArtifactVersionUploadTOSaveTypeEnum} from "../../api/models";
import helpers from "../../constants/Functions";
import {GET_VERSIONS, LATEST_VERSION, SUCCESS, SYNC_STATUS_VERSION, UNHANDLEDERROR} from "../constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const createOrUpdateVersion = (
    bpmnArtifactId: string,
    file: string,
    saveType: ArtifactVersionUploadTOSaveTypeEnum,
    comment?: string
) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const versionController = new api.VersionApi();
        try {
            const artifactVersionUploadTO: ArtifactVersionUploadTO = {
                xml: file,
                versionComment: comment,
                saveType: saveType
            };
            const config = helpers.getClientConfig();
            const response = await versionController.createOrUpdateVersion(
                artifactVersionUploadTO, bpmnArtifactId, config
            );
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "version.created" });
                dispatch({ type: SYNC_STATUS_VERSION, dataSynced: false });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_VERSION, [
                bpmnArtifactId, file, saveType, comment
            ]));
        }
    };
};

export const getAllVersions = (bpmnArtifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const versionController = new api.VersionApi();
            const config = helpers.getClientConfig();
            const response = await versionController.getAllVersions(bpmnArtifactId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: GET_VERSIONS, versions: response.data });
                dispatch({type: SYNC_STATUS_VERSION, dataSynced: true});
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_ALL_VERSIONS, [bpmnArtifactId]));
        }
    };
};

export const getLatestVersion = (bpmnArtifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const versionController = new api.VersionApi();
            const config = helpers.getClientConfig();
            const response = await versionController.getLatestVersion(bpmnArtifactId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: LATEST_VERSION, latestVersion: response.data });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.LATEST_VERSION, [bpmnArtifactId]));
        }
    };
};

export const downloadVersion = (bpmnArtifactId: string, bpmnArtifactVersionId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const versionController = new api.VersionApi();
            const config = helpers.getClientConfig();
            const response = await versionController.downloadVersion(bpmnArtifactId, bpmnArtifactVersionId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "version.downloading" });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.LATEST_VERSION, [bpmnArtifactId]));
        }
    };
};