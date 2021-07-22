import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {DeploymentTO} from "../../api/models";
import helpers from "../../constants/Functions";
import {SUCCESS, SYNC_STATUS_VERSION, TARGETS, UNHANDLEDERROR} from "../constants";
import {handleError} from "./errorAction";
import {ActionType} from "./actions";


export const deployVersion = (target: string, diagramId: string, versionId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const deploymentController = new api.DeploymentApi();
        try {
            const deploymentTO: DeploymentTO = {
                target
            };
            const config = helpers.getClientConfig();
            const response = await deploymentController.deployVersion(deploymentTO, diagramId, versionId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "version.deployed" });
                dispatch({type: SYNC_STATUS_VERSION, dataSynced: false})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.DEPLOY_VERSION, [
                target, diagramId, versionId
            ]));
        }
    };
};


export const fetchTargets = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const deploymentController = new api.DeploymentApi();
        try {
            const config = helpers.getClientConfig();
            const response = await deploymentController.getAllDeploymentTargets(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: TARGETS, targets: response.data})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_TARGETS, []));
        }
    };
};