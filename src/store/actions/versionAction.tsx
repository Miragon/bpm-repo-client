import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {DiagramVersionUploadTO, DiagramVersionUploadTOSaveTypeEnum} from "../../api/models";
import helpers from "../../constants/Functions";
import {CREATED_DIAGRAM, GET_VERSIONS, LATEST_VERSION, SUCCESS, SYNC_STATUS, UNHANDLEDERROR} from "../constants";
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
                dispatch({ type: SUCCESS, successMessage: "Version Created" });
                dispatch({ type: CREATED_DIAGRAM, createdDiagram: null });
                dispatch({ type: SYNC_STATUS, dataSynced: false });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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
                dispatch({ type: SUCCESS, successMessage: "Downloading Version" });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.LATEST_VERSION, [bpmnDiagramId]));
        }
    };
};