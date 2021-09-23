import {AssignmentApi, AssignmentTO, AssignmentTORoleEnum} from "../../api";
import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";


export const fetchAssignedUsers = async (repoId: string): Promise<AxiosResponse<AssignmentTO[]>> => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const response = await assignmentController.getAllAssignedUsers(repoId, config);
    return response;
}


export const createUserAssignment = async (repoId: string, userId: string, username: string, role: AssignmentTORoleEnum): Promise<AxiosResponse<AssignmentTO>> => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const assignmentTO: AssignmentTO = {
        repositoryId: repoId,
        userId: userId,
        username: username,
        role: (role) || AssignmentTORoleEnum.Member
    }
    const response = await assignmentController.createUserAssignment(assignmentTO, config);
    return response;
}


export const updateUserAssignment = async (repoId: string, userId: string, username: string, role: AssignmentTORoleEnum): Promise<AxiosResponse<AssignmentTO>> => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const assignmentUpdateTO: AssignmentTO = {
        repositoryId: repoId,
        userId: userId,
        username: username,
        role: role
    };
    const response = await assignmentController.updateUserAssignment(assignmentUpdateTO, config);
    return response;
}

export const deleteAssignment = async (repoId: string, userId: string): Promise<AxiosResponse<void>> => {
    const assignmentController = new AssignmentApi();
    const config = helpers.getClientConfig();
    const response = await assignmentController.deleteUserAssignment(repoId, userId, config);
    return response;
}

