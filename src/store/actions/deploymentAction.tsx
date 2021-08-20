import {Dispatch} from "@reduxjs/toolkit";
import {DeploymentApi, NewDeploymentTO} from "../../api";
import helpers from "../../util/helperFunctions";
import {HANDLEDERROR, SUCCESS, SYNC_STATUS_VERSION, TARGETS} from "../../constants/Constants";
import {handleError} from "./errorAction";
import {ActionType} from "./actions";


export const deployVersion = (target: string, artifactId: string, versionId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const deploymentController = new DeploymentApi();
        try {
            const deploymentTO: NewDeploymentTO = {
                target
            };
            const config = helpers.getClientConfig();
            const response = await deploymentController.deployVersion( artifactId, versionId, deploymentTO, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "version.deployed" });
                dispatch({type: SYNC_STATUS_VERSION, dataSynced: false})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.DEPLOY_VERSION, [
                target, artifactId, versionId
            ]));
        }
    };
};


export const fetchTargets = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const deploymentController = new DeploymentApi();
        try {
            const config = helpers.getClientConfig();
            const response = await deploymentController.getAllDeploymentTargets(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: TARGETS, targets: response.data})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_TARGETS, []));
        }
    };
};