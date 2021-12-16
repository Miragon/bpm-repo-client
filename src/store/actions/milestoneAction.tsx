import { AxiosResponse } from "axios";
import * as api from "../../api/api";
import { ArtifactMilestoneTO, ArtifactMilestoneUpdateTO, ArtifactMilestoneUploadTO } from "../../api/api";
import { getClientConfig } from "../../api/config";

export const createMilestone = async (artifactId: string, file: string, comment?: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    const artifactMilestoneUploadTO: ArtifactMilestoneUploadTO = { file, comment };
    return milestoneController.createMilestone(artifactId, artifactMilestoneUploadTO, config);
};

export const getAllMilestones = async (artifactId: string): Promise<AxiosResponse<ArtifactMilestoneTO[]>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    return milestoneController.getAllMilestones(artifactId, config);
};

export const getLatestMilestone = async (artifactId: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    return milestoneController.getLatestMilestone(artifactId, config);
};

export const updateMilestone = async (milestoneId: string, file?: string, comment?: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    const artifactMilestoneUpdateTO: ArtifactMilestoneUpdateTO = {
        milestoneId, file, comment
    };
    return milestoneController.updateMilestone(artifactMilestoneUpdateTO, config);
};

export const getAllByDeploymentId = async (deploymentIds: Array<string>): Promise<AxiosResponse<Array<ArtifactMilestoneTO>>> => {
    const milestoneController = new api.MilestoneApi();
    const config = getClientConfig();
    return milestoneController.getAllByDeploymentIds(deploymentIds, config);
};
