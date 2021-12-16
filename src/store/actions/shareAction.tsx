import { AxiosResponse } from "axios";
import {
    ArtifactTO,
    ShareApi,
    SharedRepositoryTO,
    ShareWithRepositoryTO,
    ShareWithRepositoryTORoleEnum,
} from "../../api";
import { getClientConfig } from "../../api/config";

export const getSharedArtifacts = async (repositoryId: string): Promise<AxiosResponse<ArtifactTO[]>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return shareController.getSharedArtifacts(repositoryId, config);
};

export const getAllSharedArtifacts = async (): Promise<AxiosResponse<ArtifactTO[]>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return shareController.getAllSharedArtifacts(config);
};

export const getAllSharedArtifactsByType = async (type: string): Promise<AxiosResponse<ArtifactTO[]>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return shareController.getSharedArtifactsByType(type, config);
};

export const unshareWithRepo = async (artifactId: string, repositoryId: string): Promise<AxiosResponse<void>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return shareController.unshareArtifactWithRepository(artifactId, repositoryId, config);
};

export const shareWithRepo = async (artifactId: string, repositoryId: string, role: ShareWithRepositoryTORoleEnum): Promise<AxiosResponse<ShareWithRepositoryTO>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    const shareWithRepositoryTO: ShareWithRepositoryTO = {
        artifactId,
        repositoryId,
        role
    };
    return shareController.shareWithRepository(shareWithRepositoryTO, config);
};

export const unshareWithTeam = async (artifactId: string, teamId: string): Promise<AxiosResponse<void>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return shareController.unshareArtifactWithTeam(artifactId, teamId, config);
};

export const getSharedRepos = async (artifactId: string): Promise<AxiosResponse<SharedRepositoryTO[]>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return shareController.getSharedRepositories(artifactId, config);
};

export const updateShareWithRepo = async (artifactId: string, repositoryId: string, role: ShareWithRepositoryTORoleEnum): Promise<AxiosResponse<ShareWithRepositoryTO>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    const shareWithRepositoryTO: ShareWithRepositoryTO = {
        artifactId, repositoryId, role
    };
    return shareController.updateShareWithRepository(shareWithRepositoryTO, config);
};

export const getSharedArtifactsFromRepositoryByType = async (repositoryId: string, type: string): Promise<AxiosResponse<Array<ArtifactTO>>> => {
    const shareController = new ShareApi();
    const config = getClientConfig();
    return shareController.getSharedArtifactsFromRepositoryByType(repositoryId, type, config);
};
