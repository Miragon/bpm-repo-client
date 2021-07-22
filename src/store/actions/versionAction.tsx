import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {DiagramVersionUploadTO, DiagramVersionUploadTOSaveTypeEnum} from "../../api/models";
import helpers from "../../constants/Functions";
import {GET_VERSIONS, LATEST_VERSION, SUCCESS, SYNC_STATUS_VERSION, UNHANDLEDERROR} from "../constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const createOrUpdateVersion = (
    bpmnDiagramId: string,
    file: string,
    saveType: DiagramVersionUploadTOSaveTypeEnum,
    comment?: string
) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const versionController = new api.VersionApi();
        try {
            const diagramVersionUploadTO: DiagramVersionUploadTO = {
                xml: file,
                versionComment: comment,
                saveType: saveType
            };
            const config = helpers.getClientConfig();
            const response = await versionController.createOrUpdateVersion(
                diagramVersionUploadTO, bpmnDiagramId, config
            );
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "version.created" });
                dispatch({ type: SYNC_STATUS_VERSION, dataSynced: false });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_VERSION, [
                bpmnDiagramId, file, saveType, comment
            ]));
        }
    };
};

export const getAllVersions = (bpmnDiagramId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const versionController = new api.VersionApi();
            const config = helpers.getClientConfig();
            const response = await versionController.getAllVersions(bpmnDiagramId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: GET_VERSIONS, versions: response.data });
                dispatch({type: SYNC_STATUS_VERSION, dataSynced: true});
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_ALL_VERSIONS, [bpmnDiagramId]));
        }
    };
};

export const getLatestVersion = (bpmnDiagramId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const versionController = new api.VersionApi();
            const config = helpers.getClientConfig();
            const response = await versionController.getLatestVersion(bpmnDiagramId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: LATEST_VERSION, latestVersion: response.data });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.LATEST_VERSION, [bpmnDiagramId]));
        }
    };
};

export const downloadVersion = (bpmnDiagramId: string, bpmnDiagramVersionId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const versionController = new api.VersionApi();
            const config = helpers.getClientConfig();
            const response = await versionController.downloadVersion(bpmnDiagramId, bpmnDiagramVersionId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "version.downloading" });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.LATEST_VERSION, [bpmnDiagramId]));
        }
    };
};