import {ArtifactMilestoneTO, DeploymentApi, NewDeploymentTO} from "../../api";
import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";


export const deployMilestone = async (target: string, artifactId: string, milestoneId: string): Promise<AxiosResponse<ArtifactMilestoneTO>> => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    const deploymentTO: NewDeploymentTO = {
        artifactId,
        milestoneId,
        target
    };
    const response = await deploymentController.deployMilestone(deploymentTO, config);
    return response;
}

export const deployMultiple = async (deployments: Array<NewDeploymentTO>): Promise<AxiosResponse<ArtifactMilestoneTO[]>> => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    console.log(deployments)
    const response = await deploymentController.deployMultipleMilestones(deployments, config)
    return response;
}


export const fetchTargets = async (): Promise<AxiosResponse<string[]>> => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    const response = await deploymentController.getAllDeploymentTargets(config);
    return response;
}

