import {AxiosResponse} from "axios";
import {AssignmentTO, AssignmentTORoleEnum, RepoAssignmentApi} from "../../api";
import {getClientConfig} from "../../api/config";

export const fetchAssignedUsers = async (repoId: string): Promise<AxiosResponse<AssignmentTO[]>> => {
    const assignmentController = new RepoAssignmentApi();
    const config = getClientConfig();
    return await assignmentController.getAllAssignedUsers(repoId, config);
}

export const createUserAssignment = async (repoId: string, userId: string, role: AssignmentTORoleEnum): Promise<AxiosResponse<AssignmentTO>> => {
    const assignmentController = new RepoAssignmentApi();
    const config = getClientConfig();
    const assignmentTO: AssignmentTO = {
        repositoryId: repoId,
        userId: userId,
        role: (role) || AssignmentTORoleEnum.Member
    }
    return await assignmentController.createUserAssignment(assignmentTO, config);
}

export const updateUserAssignment = async (repoId: string, userId: string, role: AssignmentTORoleEnum): Promise<AxiosResponse<AssignmentTO>> => {
    const assignmentController = new RepoAssignmentApi();
    const config = getClientConfig();
    const assignmentUpdateTO: AssignmentTO = {
        repositoryId: repoId,
        userId: userId,
        role: role
    };
    return await assignmentController.updateUserAssignment(assignmentUpdateTO, config);
}

export const deleteAssignment = async (repoId: string, userId: string): Promise<AxiosResponse<void>> => {
    const assignmentController = new RepoAssignmentApi();
    const config = getClientConfig();
    return await assignmentController.deleteUserAssignment(repoId, userId, config);
}

