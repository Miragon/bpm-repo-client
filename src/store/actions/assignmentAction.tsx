import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {AssignmentUpdateTO, AssignmentUpdateTORoleEnumEnum} from "../../api/models";
import helpers from "../../constants/Functions";
import {ASSIGNED_USERS, SUCCESS, SYNC_STATUS_ASSIGNMENT, UNHANDLEDERROR} from "../constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const getAllAssignedUsers = (repoId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const assignmentController = new api.AssignmentApi();

        try {
            const config = helpers.getClientConfig();
            const response = await assignmentController.getAllAssignedUsers(repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ASSIGNED_USERS, assignedUsers: response.data });
                dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: true });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_ALL_ASSIGNED_USERS, [repoId]));
        }
    };
};

export const createOrUpdateUserAssignment = (
    repoId: string,
    userId: string,
    username: string,
    roleEnum?: AssignmentUpdateTORoleEnumEnum
) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const assignmentController = new api.AssignmentApi();
        let message;
        try {
            if (!roleEnum) {
                message = "assignment.added";
            } else {
                message = {content: "assignment.changedAssignment", variables: {username: username, roleEnum: roleEnum ? roleEnum : AssignmentUpdateTORoleEnumEnum.MEMBER}};
            }

            const assignmentUpdateTO: AssignmentUpdateTO = {
                repositoryId: repoId,
                userId: userId,
                username: username,
                roleEnum: (roleEnum) || AssignmentUpdateTORoleEnumEnum.MEMBER
            };
            const config = helpers.getClientConfig();
            const response = await assignmentController
                .createOrUpdateUserAssignment(assignmentUpdateTO, config);
            if (Math.floor(response.status / 100) === 2) {
                (typeof message === "string") ? dispatch({ type: SUCCESS, successMessage: message}) : dispatch({ type: SUCCESS, successMessageWithVariables: message});
                dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: false });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess"});
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_USER_ASSIGNMENT, [
                repoId, userId, username, roleEnum
            ]));
        }
    };
};

export const deleteAssignment = (repoId: string, username: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const assignmentController = new api.AssignmentApi();
        try {
            const config = helpers.getClientConfig();
            const response = await assignmentController
                .deleteUserAssignment(repoId, username, config);
            if (Math.floor(response.status / 100) === 2) {
                // eslint-disable-next-line object-shorthand
                dispatch({ type: SUCCESS, successMessageWithVariables: {content: "assignment.removed", variables: {username: username}} });
                dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: false });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.DELETE_ASSIGNMENT, [repoId, username]));
        }
    };
};
