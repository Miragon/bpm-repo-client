import {Dispatch} from "@reduxjs/toolkit";
import {AssignmentApi, AssignmentUpdateTO, AssignmentUpdateTORoleEnum} from "../../api";
import helpers from "../../util/helperFunctions";
import {ASSIGNED_USERS, HANDLEDERROR, SUCCESS, SYNC_STATUS_ASSIGNMENT} from "../../constants/Constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const getAllAssignedUsers = (repoId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const assignmentController = new AssignmentApi();

        try {
            const config = helpers.getClientConfig();
            const response = await assignmentController.getAllAssignedUsers(repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ASSIGNED_USERS, assignedUsers: response.data });
                dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: true });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_ALL_ASSIGNED_USERS, [repoId]));
        }
    };
};

export const createUserAssignment = (repoId: string, userId: string, username: string, role?: AssignmentUpdateTORoleEnum) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const assignmentController = new AssignmentApi();
        try {
            const assignmentUpdateTO: AssignmentUpdateTO = {
                repositoryId: repoId,
                userId: userId,
                username: username,
                role: (role) || AssignmentUpdateTORoleEnum.Member
            };
            const config = helpers.getClientConfig();
            const response = await assignmentController.createUserAssignment(assignmentUpdateTO, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ASSIGNED_USERS, assignedUsers: response.data });
                dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: true });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_USER_ASSIGNMENT, [repoId, userId, username, role]));
        }
    };
};



export const updateUserAssignment = (repoId: string, userId: string, username: string, role: AssignmentUpdateTORoleEnum) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const assignmentController = new AssignmentApi();
        let message;
        try {
            message = {content: "assignment.changedAssignment", variables: {username, role}};
            const assignmentUpdateTO: AssignmentUpdateTO = {
                repositoryId: repoId,
                userId: userId,
                username: username,
                role: (role) || AssignmentUpdateTORoleEnum.Member
            };
            const config = helpers.getClientConfig();
            const response = await assignmentController.updateUserAssignment(assignmentUpdateTO, config);
            if (Math.floor(response.status / 100) === 2) {
                (typeof message === "string") ? dispatch({ type: SUCCESS, successMessage: message}) : dispatch({ type: SUCCESS, successMessageWithVariables: message});
                dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: false });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess"});
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.UPDATE_USER_ASSIGNMENT, [repoId, userId, username, role]));
        }
    };
};

export const deleteAssignment = (repoId: string, username: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const assignmentController = new AssignmentApi();
        try {
            const config = helpers.getClientConfig();
            const response = await assignmentController
                .deleteUserAssignment(repoId, username, config);
            if (Math.floor(response.status / 100) === 2) {
                // eslint-disable-next-line object-shorthand
                dispatch({ type: SUCCESS, successMessageWithVariables: {content: "assignment.removed", variables: {username: username}} });
                dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: false });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.DELETE_ASSIGNMENT, [repoId, username]));
        }
    };
};
