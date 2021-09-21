import {AxiosResponse} from "axios";
import {ArtifactTO, NewTeamTO, ShareApi, TeamApi, TeamAssignmentApi, TeamAssignmentTO, TeamTO} from "../../api";
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