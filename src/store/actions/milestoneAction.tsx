import * as api from "../../api/api";
import {ArtifactMilestoneTO, ArtifactMilestoneUpdateTO, ArtifactMilestoneUploadTO} from "../../api/api";
import {AxiosResponse} from "axios";
import {getClientConfig} from "../../api/config";


export const createMilestone = async (artifactId: string, file: string, comment?: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    const artifactMilestoneUploadTO: ArtifactMilestoneUploadTO = {file, comment};
    return await milestoneController.createMilestone(artifactId, artifactMilestoneUploadTO, config)
}

export const getAllMilestones = async (artifactId: string): Promise<AxiosResponse<ArtifactMilestoneTO[]>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    return await milestoneController.getAllMilestones(artifactId, config);
}

export const getLatestMilestone = async (artifactId: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    return await milestoneController.getLatestMilestone(artifactId, config)
}

export const updateMilestone = async (milestoneId: string, file?: string, comment?: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    const artifactMilestoneUpdateTO: ArtifactMilestoneUpdateTO = {
        milestoneId, file, comment
    }
    return await milestoneController.updateMilestone(artifactMilestoneUpdateTO, config)
}

export const getAllByDeploymentId = async (deploymentIds: Array<string>): Promise<AxiosResponse<Array<ArtifactMilestoneTO>>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    return await milestoneController.getAllByDeploymentIds(deploymentIds, config);
}