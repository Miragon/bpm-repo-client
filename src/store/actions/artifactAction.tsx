import {ArtifactApi, ArtifactUpdateTO, NewArtifactTO} from "../../api";
import helpers from "../../util/helperFunctions";

export const fetchFavoriteArtifacts = async () => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await artifactController.getStarred(config);
    return response;
}



export const fetchRecentArtifacts = async () => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await artifactController.getRecent(config);
    return response;
}


export const createArtifact = async (repoId: string, name: string, description: string, fileType: string) => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const newArtifactTO: NewArtifactTO = {
        name: name,
        description: description,
        fileType: fileType,
        svgPreview: ""
    };
    const response = await artifactController.createArtifact(repoId, newArtifactTO, config)
    return response
}


export const updateArtifact = async (name: string, description: string | undefined, artifactId: string) => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const artifactUpdateTO: ArtifactUpdateTO = {
        name: name,
        description: description || ""
    }
    const response = await artifactController.updateArtifact(artifactId, artifactUpdateTO, config);
    return response;
}


export const fetchArtifactsFromRepo = async (repoId: string) => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await artifactController.getArtifactsFromRepo(repoId, config);
    return response;
}


export const uploadArtifact = async (repoId: string, name: string, description: string, fileType: string) => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const newArtifact: NewArtifactTO = {name, description, fileType};
    const response = await artifactController.createArtifact(repoId, newArtifact, config);
    return response;
}

export const searchArtifact = async (typedTitle: string) => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await artifactController.searchArtifacts(typedTitle, config);
    return response;
}


export const addToFavorites = async (artifactId: string) => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await artifactController.setStarred(artifactId, config);
    return response;
}


export const copyToRepo = async (repositoryId: string, artifactId: string) => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await artifactController.copyToRepository(repositoryId, artifactId, config);
    return response;
}

export const deleteArtifact = async (artifactId: string) => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await artifactController.deleteArtifact(artifactId, config);
    return response
}


export const getByRepositoryIdAndType = async (repositoryId: string, type: string) => {
    const artifactController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await artifactController.getByRepoIdAndType(repositoryId, type, config);
    return response;
}

