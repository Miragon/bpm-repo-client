import {AssignmentApi, AssignmentTO, AssignmentUpdateTO, AssignmentUpdateTORoleEnum} from "../../api";
import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";
//TODO DELETE
export const getAllAssignedUsers = (repoId: string) => {
    return async (): Promise<AxiosResponse<AssignmentTO[]>> => {
        const assignmentController = new AssignmentApi();
        try {
            const config = helpers.getClientConfig();

            const response = await assignmentController.getAllAssignedUsers(repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                return response;
            } else {
                return response;
            }
        } catch (error) {
            return error.response;
        }
    };
};



export const fetchAssignedUsers = async (repoId: string) => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const response = await assignmentController.getAllAssignedUsers(repoId, config);
    if(response.status / 100 === 2){
        //  dispatch({type: ASSIGNED_USERS, assignedUsers: response.data})
        console.log("simple fetch")
    }
    return response;
}


export const createUserAssignment = async (repoId: string, userId: string, username: string, role?: AssignmentUpdateTORoleEnum) => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const assignmentUpdateTO: AssignmentUpdateTO = {
        repositoryId: repoId,
        userId: userId,
        username: username,
        role: (role) || AssignmentUpdateTORoleEnum.Member
    }
    const response = await assignmentController.createUserAssignment(assignmentUpdateTO, config);
    return response;
}


//TODO DELETE
/*
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
                dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: false });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_USER_ASSIGNMENT, [repoId, userId, username, role]));
        }
    };
};

 */



export const updateUserAssignment = async (repoId: string, userId: string, username: string, role: AssignmentUpdateTORoleEnum) => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const assignmentUpdateTO: AssignmentUpdateTO = {
        repositoryId: repoId,
        userId: userId,
        username: username,
        role: (role) || AssignmentUpdateTORoleEnum.Member
    };
    const response = await assignmentController.updateUserAssignment(assignmentUpdateTO, config);
    return response;
}

export const deleteAssignment = async (repoId: string, username: string) => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const response = await assignmentController.deleteUserAssignment(repoId, username, config);
    return response;
}

