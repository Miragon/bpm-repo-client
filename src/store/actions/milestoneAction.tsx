import * as api from "../../api/api";
import {
    ArtifactMilestoneTO,
    ArtifactMilestoneUpdateTO,
    ArtifactMilestoneUploadTO,
    ArtifactMilestoneUploadTOSaveTypeEnum
} from "../../api/api";

import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";


export const createMilestone = async (artifactId: string, file: string, saveType: ArtifactMilestoneUploadTOSaveTypeEnum, comment?: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const milestoneController = new api.MilestoneApi();
    const config = helpers.getClientConfig();
    const artifactMilestoneUploadTO: ArtifactMilestoneUploadTO = {file, comment, saveType};
    const response = await milestoneController.createMilestone(artifactId, artifactMilestoneUploadTO, config);
    return response
}

export const getAllMilestones = async (artifactId: string): Promise<AxiosResponse<ArtifactMilestoneTO[]>> => {
    const milestoneController = new api.MilestoneApi();
    const config = helpers.getClientConfig();
    const response = await milestoneController.getAllMilestones(artifactId, config);
    return response;
}


export const getLatestMilestone = async (artifactId: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const milestoneController = new api.MilestoneApi();
    const config = helpers.getClientConfig();
    const response = await milestoneController.getLatestMilestone(artifactId, config);
    return response
}

export const updateMilestone = async (milestoneId: string, file?: string, comment?: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const milestoneController = new api.MilestoneApi();
    const config = helpers.getClientConfig();
    const artifactMilestoneUpdateTO: ArtifactMilestoneUpdateTO = {
        milestoneId, file, comment
    }
    const response = await milestoneController.updateMilestone(artifactMilestoneUpdateTO, config);
    return response
}

export const getAllByDeploymentId = async(deploymentIds: Array<string>): Promise<AxiosResponse<Array<ArtifactMilestoneTO>>> => {
    const milestoneController = new api.MilestoneApi();
    const config = helpers.getClientConfig();
    const response = await milestoneController.getAllByDeploymentIds(deploymentIds, config);
    return response;
}