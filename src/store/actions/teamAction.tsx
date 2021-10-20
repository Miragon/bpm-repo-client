import {AxiosResponse} from "axios";
import {NewTeamTO, TeamApi, TeamTO, TeamUpdateTO} from "../../api";
import helpers from "../../util/helperFunctions";

export const createTeam = async(name: string, description: string): Promise<AxiosResponse<TeamTO>> => {
    const teamController = new TeamApi();
    const config = helpers.getClientConfig();
    const newTeamTO: NewTeamTO = {
        name, description
    }
    const response = await teamController.createTeam(newTeamTO, config);
    return response;
}

export const updateTeam = async(teamId: string, name: string, description: string): Promise<AxiosResponse<TeamTO>> => {
    const teamController = new TeamApi();
    const config = helpers.getClientConfig();
    const teamUpdateTO: TeamUpdateTO = {
        name, description
    }
    const response = await teamController.updateTeam(teamId, teamUpdateTO, config);
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

export const deleteTeam = async(teamId: string): Promise<AxiosResponse> => {
    const teamController = new TeamApi();
    const config = helpers.getClientConfig();
    const response = await teamController.searchTeams(teamId, config);
    return response;
}