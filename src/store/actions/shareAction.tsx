import helpers from "../../util/helperFunctions";
import {
    ArtifactTO,
    ShareApi,
    SharedRepositoryTO,
    SharedTeamTO,
    ShareWithRepositoryTO,
    ShareWithRepositoryTORoleEnum,
    ShareWithTeamTO,
    ShareWithTeamTORoleEnum
} from "../../api";
import {AxiosResponse} from "axios";

export const getSharedArtifacts = async(repositoryId: string): Promise<AxiosResponse<ArtifactTO[]>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getSharedArtifacts(repositoryId, config);
    return response;
}

export const getAllSharedArtifacts = async (): Promise<AxiosResponse<ArtifactTO[]>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getAllSharedArtifacts(config);
    return response;
}

export const getAllSharedArtifactsByType = async (type: string): Promise<AxiosResponse<ArtifactTO[]>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getSharedArtifactsByType(type, config);
    return response;
}

export const getAllArtifactsSharedWithTeam = async (teamId: string): Promise<AxiosResponse<Array<ArtifactTO>>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getSharedWithTeamArtifacts(teamId, config);
    return response;
}


export const unshareWithRepo = async (artifactId: string, repositoryId: string): Promise<AxiosResponse<void>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.unshareArtifactWithRepository(artifactId, repositoryId, config);
    return response;
}


export const shareWithRepo = async (artifactId: string, repositoryId: string, role: ShareWithRepositoryTORoleEnum): Promise<AxiosResponse<ShareWithRepositoryTO>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const shareWithRepositoryTO: ShareWithRepositoryTO = {
        artifactId,
        repositoryId,
        role
    }
    const response = await shareController.shareWithRepository(shareWithRepositoryTO, config);
    return response
}

export const shareWithTeam = async (artifactId: string, teamId: string, role: ShareWithTeamTORoleEnum): Promise<AxiosResponse<ShareWithTeamTO>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const shareWithTeamTO: ShareWithTeamTO = {
        artifactId, teamId, role
    }
    const response = await shareController.shareWithTeam(shareWithTeamTO, config);
    return response
}


export const unshareWithTeam = async (artifactId: string, teamId: string): Promise<AxiosResponse<void>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.unshareArtifactWithTeam(artifactId, teamId, config);
    return response;
}



export const getSharedRepos = async (artifactId: string): Promise<AxiosResponse<SharedRepositoryTO[]>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getSharedRepositories(artifactId, config);
    return response;
}

export const getSharedTeams = async (artifactId: string): Promise<AxiosResponse<SharedTeamTO[]>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getSharedTeams(artifactId, config);
    return response;
}

export const updateShareWithRepo = async (artifactId: string, repositoryId: string, role: ShareWithRepositoryTORoleEnum): Promise<AxiosResponse<ShareWithRepositoryTO>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const shareWithRepositoryTO: ShareWithRepositoryTO = {
        artifactId, repositoryId, role
    }
    const response = await shareController.updateShareWithRepository(shareWithRepositoryTO, config);
    return response;
}

export const updateShareWithTeam = async (artifactId: string, teamId: string, role: ShareWithTeamTORoleEnum): Promise<AxiosResponse<ShareWithTeamTO>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const shareWithTeamTO: ShareWithTeamTO = {
        artifactId, teamId, role
    }
    const response = await shareController.updateShareWithTeam(shareWithTeamTO, config);
    return response;
}

export const getSharedArtifactsFromRepositoryByType= async(repositoryId: string, type: string): Promise<AxiosResponse<Array<ArtifactTO>>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getSharedArtifactsFromRepositoryByType(repositoryId, type, config);
    return response;
}