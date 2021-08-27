import {AssignmentApi, AssignmentTO, AssignmentUpdateTO, AssignmentUpdateTORoleEnum} from "../../api";
import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";


export const fetchAssignedUsers = async (repoId: string): Promise<AxiosResponse<AssignmentTO[]>> => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const response = await assignmentController.getAllAssignedUsers(repoId, config);
    return response;
}


export const createUserAssignment = async (repoId: string, userId: string, username: string, role?: AssignmentUpdateTORoleEnum): Promise<AxiosResponse<AssignmentTO>> => {
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


export const updateUserAssignment = async (repoId: string, userId: string, username: string, role: AssignmentUpdateTORoleEnum): Promise<AxiosResponse<AssignmentTO>> => {
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

export const deleteAssignment = async (repoId: string, username: string): Promise<AxiosResponse<void>> => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const response = await assignmentController.deleteUserAssignment(repoId, username, config);
    return response;
}

