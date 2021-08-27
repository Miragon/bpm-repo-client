import helpers from "../../util/helperFunctions";
import {ArtifactTO, RepositoryTO, ShareApi, ShareWithRepositoryTO, ShareWithRepositoryTORoleEnum} from "../../api";
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
//TODO                   dispatch({type: SHARED_ARTIFACTS, sharedArtifacts: response.data})



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


export const getSharedRepos = async (artifactId: string): Promise<AxiosResponse<RepositoryTO[]>> => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getSharedRepositories(artifactId, config);
    return response;
}
