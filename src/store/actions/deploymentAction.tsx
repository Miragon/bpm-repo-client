import {ArtifactMilestoneTO, DeploymentApi, DeploymentTO, NewDeploymentTO} from "../../api";
import {AxiosResponse} from "axios";
import {getClientConfig} from "../../api/config";

export const deployMilestone = async (target: string, repositoryId: string, artifactId: string, milestoneId: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const deploymentController = new DeploymentApi();
    const config = getClientConfig();
    const deploymentTO: NewDeploymentTO = {
        repositoryId,
        artifactId,
        milestoneId,
        target
    };
    return await deploymentController.deployMilestone(deploymentTO, config);
}

export const deployMultiple = async (deployments: Array<NewDeploymentTO>): Promise<AxiosResponse<ArtifactMilestoneTO[]>> => {
    const deploymentController = new DeploymentApi();
    const config = getClientConfig();
    return await deploymentController.deployMultipleMilestones(deployments, config);
}

export const fetchTargets = async (): Promise<AxiosResponse<string[]>> => {
    const deploymentController = new DeploymentApi();
    const config = getClientConfig();
    return await deploymentController.getAllDeploymentTargets(config);
}

export const getAllDeploymentsFromRepository = async (repositoryId: string): Promise<AxiosResponse<Array<DeploymentTO>>> => {
    const deploymentController = new DeploymentApi();
    const config = getClientConfig();
    return await deploymentController.getAllDeploymentsFromRepository(repositoryId, config)
}