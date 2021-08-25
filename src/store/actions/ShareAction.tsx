import {Dispatch} from "@reduxjs/toolkit";
import helpers from "../../util/helperFunctions";
import {HANDLEDERROR, SHARED_ARTIFACTS} from "../../constants/Constants";
import {ShareApi, ShareWithRepositoryTO, ShareWithRepositoryTORoleEnum} from "../../api";

export const getSharedArtifacts = async(repositoryId: string) => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getSharedArtifacts(repositoryId, config);
    return response;
}

export const getAllSharedArtifacts = async () => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getAllSharedArtifacts(config);
    return response;
}
//TODO                   dispatch({type: SHARED_ARTIFACTS, sharedArtifacts: response.data})



export const unshareWithRepo = async (artifactId: string, repositoryId: string) => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.unshareArtifactWithRepository(artifactId, repositoryId, config);
    return response;
}


export const shareWithRepo = async (artifactId: string, repositoryId: string, role: ShareWithRepositoryTORoleEnum) => {
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


export const getSharedRepos = async (artifactId: string) => {
    const shareController = new ShareApi();
    const config = helpers.getClientConfig();
    const response = await shareController.getSharedRepositories(artifactId, config);
    return response;
}
