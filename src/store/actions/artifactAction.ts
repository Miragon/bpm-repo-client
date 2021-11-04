import {ArtifactApi, ArtifactTO, ArtifactUpdateTO, NewArtifactTO} from "../../api";
import {AxiosResponse} from "axios";
import {getClientConfig} from "../../api/config";

export const fetchFavoriteArtifacts = async (): Promise<AxiosResponse<ArtifactTO[]>> => {
    const artifactController = new ArtifactApi();
    const config = getClientConfig();
    return await artifactController.getStarred(config);
}

export const fetchRecentArtifacts = async (): Promise<AxiosResponse<ArtifactTO[]>> => {
    const artifactController = new ArtifactApi();
    const config = getClientConfig();
    return await artifactController.getRecent(config);
}

export const createArtifact = async (repoId: string, name: string, description: string, fileType: string, file?: string): Promise<AxiosResponse<ArtifactTO>> => {
    const artifactController = new ArtifactApi();
    const config = getClientConfig();
    const newArtifactTO: NewArtifactTO = {
        name,
        description,
        fileType,
        file
    };
    return await artifactController.createArtifact(repoId, newArtifactTO, config)
}

export const updateArtifact = async (name: string, description: string | undefined, artifactId: string): Promise<AxiosResponse<ArtifactTO>> => {
    const artifactController = new ArtifactApi();
    const config = getClientConfig();
    const artifactUpdateTO: ArtifactUpdateTO = {
        name: name,
        description: description || ""
    }
    return await artifactController.updateArtifact(artifactId, artifactUpdateTO, config);
}

export const fetchArtifactsFromRepo = async (repoId: string): Promise<AxiosResponse<ArtifactTO[]>> => {
    const artifactController = new ArtifactApi();
    const config = getClientConfig();
    return await artifactController.getArtifactsFromRepo(repoId, config);
}


export const searchArtifact = async (typedTitle: string): Promise<AxiosResponse<ArtifactTO[]>> => {
    const artifactController = new ArtifactApi();
    const config = getClientConfig();
    return await artifactController.searchArtifacts(typedTitle, config);
}


export const addToFavorites = async (artifactId: string): Promise<AxiosResponse<void>> => {
    const artifactController = new ArtifactApi();
    const config = getClientConfig();
    return await artifactController.setStarred(artifactId, config);
}


export const copyToRepo = async (repositoryId: string, artifactId: string, name: string, description: string): Promise<AxiosResponse<ArtifactTO>> => {
    const artifactController = new ArtifactApi();
    const artifactUpdateTO: ArtifactUpdateTO = {
        name, description
    }
    const config = getClientConfig();
    return await artifactController.copyToRepository(repositoryId, artifactId, artifactUpdateTO, config);
}

export const deleteArtifact = async (artifactId: string): Promise<AxiosResponse<void>> => {
    const artifactController = new ArtifactApi();
    const config = getClientConfig();
    return await artifactController.deleteArtifact(artifactId, config)
}

export const getByRepositoryIdAndType = async (repositoryId: string, type: string): Promise<AxiosResponse<ArtifactTO[]>> => {
    const artifactController = new ArtifactApi();
    const config = getClientConfig();
    return await artifactController.getByRepoIdAndType(repositoryId, type, config);
}

