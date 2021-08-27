import * as api from "../../api/api";
import {ArtifactVersionTO} from "../../api/api";
import {ArtifactVersionUploadTO, ArtifactVersionUploadTOSaveTypeEnum} from "../../api";
import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";


export const createVersion = async (artifactId: string, file: string, saveType: ArtifactVersionUploadTOSaveTypeEnum, comment?: string): Promise<AxiosResponse<ArtifactVersionTO>> => {
    const versionController = new api.VersionApi();
    const config = helpers.getClientConfig();
    const artifactVersionUploadTO: ArtifactVersionUploadTO = {file, comment, saveType};
    const response = await versionController.createVersion(artifactId, artifactVersionUploadTO, config);
    return response
}

export const getAllVersions = async (artifactId: string): Promise<AxiosResponse<ArtifactVersionTO[]>> => {
    const versionController = new api.VersionApi();
    const config = helpers.getClientConfig();
    const response = await versionController.getAllVersions(artifactId, config);
    return response;
}


export const getLatestVersion = async (artifactId: string): Promise<AxiosResponse<ArtifactVersionTO>> => {
    const versionController = new api.VersionApi();
    const config = helpers.getClientConfig();
    const response = await versionController.getLatestVersion(artifactId, config);
    return response
}
