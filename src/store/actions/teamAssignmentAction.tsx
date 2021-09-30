import {TeamAssignmentApi, TeamAssignmentTO, TeamAssignmentTORoleEnum} from "../../api";
import {AxiosResponse} from "axios";
import helpers from "../../util/helperFunctions";


export const fetchTeamAssignedUsers = async (teamId: string): Promise<AxiosResponse<TeamAssignmentTO[]>> => {
    const teamAssignmentController = new TeamAssignmentApi();
    const config = helpers.getClientConfig();
    const response = await teamAssignmentController.getAllTeamAssignedUsers(teamId, config);
    return response;
}

export const createUserTeamAssignment = async(teamId: string, userId: string, role: TeamAssignmentTORoleEnum): Promise<AxiosResponse> => {
    const teamAssignmentController = new TeamAssignmentApi();
    const config = helpers.getClientConfig();
    const teamAssignmentTO: TeamAssignmentTO = {
        teamId,
        userId,
        role
    }
    const response = await teamAssignmentController.createTeamAssignment(teamAssignmentTO, config);
    return response;
}

export const updateUserTeamAssignment = async(teamId: string, userId: string, role: TeamAssignmentTORoleEnum): Promise<AxiosResponse> => {
    const teamAssignmentController = new TeamAssignmentApi();
    const config = helpers.getClientConfig();
    const teamAssignmentTO: TeamAssignmentTO = {
        teamId,
        userId,
        role
    };
    const response = await teamAssignmentController.updateTeamAssignment(teamAssignmentTO, config);
    return response;
}

export const deleteUserTeamAssignment = async (teamId: string, userId: string): Promise<AxiosResponse> => {
    const teamAssignmentController = new TeamAssignmentApi();
    const config = helpers.getClientConfig();
    const response = await teamAssignmentController.deleteTeamUserAssignment(teamId, userId, config);
    return response;
}