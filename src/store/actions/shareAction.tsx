import {
    ArtifactTO,
    ShareApi,
    SharedRepositoryTO,
    ShareWithRepositoryTO,
    ShareWithRepositoryTORoleEnum,
} from "../../api";
import {AxiosResponse} from "axios";
import {getClientConfig} from "../../api/config";

export const getSharedArtifacts = async (repositoryId: string): Promise<AxiosResponse<ArtifactTO[]>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return await shareController.getSharedArtifacts(repositoryId, config);
}

export const getAllSharedArtifacts = async (): Promise<AxiosResponse<ArtifactTO[]>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return await shareController.getAllSharedArtifacts(config);
}

export const getAllSharedArtifactsByType = async (type: string): Promise<AxiosResponse<ArtifactTO[]>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return await shareController.getSharedArtifactsByType(type, config);
}

export const unshareWithRepo = async (artifactId: string, repositoryId: string): Promise<AxiosResponse<void>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return await shareController.unshareArtifactWithRepository(artifactId, repositoryId, config);
}


export const shareWithRepo = async (artifactId: string, repositoryId: string, role: ShareWithRepositoryTORoleEnum): Promise<AxiosResponse<ShareWithRepositoryTO>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    const shareWithRepositoryTO: ShareWithRepositoryTO = {
        artifactId,
        repositoryId,
        role
    }
    return await shareController.shareWithRepository(shareWithRepositoryTO, config)
}

export const unshareWithTeam = async (artifactId: string, teamId: string): Promise<AxiosResponse<void>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return await shareController.unshareArtifactWithTeam(artifactId, teamId, config);
}


export const getSharedRepos = async (artifactId: string): Promise<AxiosResponse<SharedRepositoryTO[]>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return await shareController.getSharedRepositories(artifactId, config);
}

export const updateShareWithRepo = async (artifactId: string, repositoryId: string, role: ShareWithRepositoryTORoleEnum): Promise<AxiosResponse<ShareWithRepositoryTO>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    const shareWithRepositoryTO: ShareWithRepositoryTO = {
        artifactId, repositoryId, role
    }
    return await shareController.updateShareWithRepository(shareWithRepositoryTO, config);
}

export const getSharedArtifactsFromRepositoryByType = async (repositoryId: string, type: string): Promise<AxiosResponse<Array<ArtifactTO>>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return await shareController.getSharedArtifactsFromRepositoryByType(repositoryId, type, config);
}