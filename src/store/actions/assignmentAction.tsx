import helpers from "../../util/helperFunctions";

import {AxiosResponse} from "axios";
import {AssignmentTO, AssignmentTORoleEnum, RepoAssignmentApi} from "../../api";


export const fetchAssignedUsers = async (repoId: string): Promise<AxiosResponse<AssignmentTO[]>> => {
    const assignmentController = new RepoAssignmentApi();
    const config = helpers.getClientConfig();
    const response = await assignmentController.getAllAssignedUsers(repoId, config);
    return response;
}


export const createUserAssignment = async (repoId: string, userId: string, role: AssignmentTORoleEnum): Promise<AxiosResponse<AssignmentTO>> => {
    const assignmentController = new RepoAssignmentApi();
    const config = helpers.getClientConfig();
    const assignmentTO: AssignmentTO = {
        repositoryId: repoId,
        userId: userId,
        role: (role) || AssignmentTORoleEnum.Member
    }
    const response = await assignmentController.createUserAssignment(assignmentTO, config);
    return response;
}


export const updateUserAssignment = async (repoId: string, userId: string, role: AssignmentTORoleEnum): Promise<AxiosResponse<AssignmentTO>> => {
    const assignmentController = new RepoAssignmentApi();
    const config = helpers.getClientConfig();
    const assignmentUpdateTO: AssignmentTO = {
        repositoryId: repoId,
        userId: userId,
        role: role
    };
    const response = await assignmentController.updateUserAssignment(assignmentUpdateTO, config);
    return response;
}

export const deleteAssignment = async (repoId: string, userId: string): Promise<AxiosResponse<void>> => {
    const assignmentController = new RepoAssignmentApi();
    const config = helpers.getClientConfig();
    const response = await assignmentController.deleteUserAssignment(repoId, userId, config);
    return response;
}

