import {ArtifactVersionTO, DeploymentApi, NewDeploymentTO} from "../../api";
import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";


export const deployVersion = async (target: string, artifactId: string, versionId: string): Promise<AxiosResponse<ArtifactVersionTO>> => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    const deploymentTO: NewDeploymentTO = {
        artifactId,
        versionId,
        target
    };
    const response = await deploymentController.deployVersion(deploymentTO, config);
    return response;
}

export const deployMultiple = async (deployments: Array<NewDeploymentTO>): Promise<AxiosResponse<ArtifactVersionTO[]>> => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    console.log(deployments)
    const response = await deploymentController.deployMultipleVersions(deployments, config)
    return response;
}


export const fetchTargets = async (): Promise<AxiosResponse<string[]>> => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    const response = await deploymentController.getAllDeploymentTargets(config);
    return response;
}

