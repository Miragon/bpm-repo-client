import {DeploymentApi, NewDeploymentTO} from "../../api";
import helpers from "../../util/helperFunctions";


export const deployVersion = async (target: string, artifactId: string, versionId: string) => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    const deploymentTO: NewDeploymentTO = {
        target
    };
    const response = await deploymentController.deployVersion( artifactId, versionId, deploymentTO, config);
    return response;
}


export const fetchTargets = async () => {
    const deploymentController = new DeploymentApi();
    const config = helpers.getClientConfig();
    const response = await deploymentController.getAllDeploymentTargets(config);
    return response;
}

