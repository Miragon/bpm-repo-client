import {AxiosResponse} from "axios";
import {NewTeamTO, TeamApi, TeamTO} from "../../api";
import helpers from "../../util/helperFunctions";

export const createTeam = async(name: string, description: string): Promise<AxiosResponse<TeamTO>> => {
    const teamAssignmentController = new TeamApi();
    const config = helpers.getClientConfig();
    const newTeamTO: NewTeamTO = {
        name, description
    }
    const response = await teamAssignmentController.createTeam(newTeamTO, config);
    return response;
}


export const getAllTeams = async(): Promise<AxiosResponse<Array<TeamTO>>> => {
    const teamController = new TeamApi();
    const config = helpers.getClientConfig();

    const response = await teamController.getAllTeams(config);
    return response;
}

export const getTeam = async(teamId: string): Promise<AxiosResponse<TeamTO>> => {
    const teamController = new TeamApi()
    const config = helpers.getClientConfig();
    const response = await teamController.getTeam(teamId, config);
    return response;

}

export const searchTeam = async(typedName: string): Promise<AxiosResponse<TeamTO[]>> => {
    const teamController = new TeamApi();
    const config = helpers.getClientConfig();
    const response = await teamController.searchTeams(typedName, config);
    return response;
}