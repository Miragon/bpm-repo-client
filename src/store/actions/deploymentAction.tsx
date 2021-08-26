import {DeploymentApi, NewDeploymentTO} from "../../api";
import helpers from "../../util/helperFunctions";


export const deployVersion = async (target: string, artifactId: string, versionId: string) => {
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

export const deployMultiple = async (deployments: Array<NewDeploymentTO>) => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    const response = await deploymentController.deployMultipleVersions(deployments, config)
    return response;
}


export const fetchTargets = async () => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    const response = await deploymentController.getAllDeploymentTargets(config);
    return response;
}

