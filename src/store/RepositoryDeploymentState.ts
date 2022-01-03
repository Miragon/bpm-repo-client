import { DeploymentApi } from "../api";
import createMapApiState from "./lib/MapApiState";

const [
    RepositoryDeploymentSlice,
    loadRepositoryDeployments,
    updateRepositoryDeployments
] = createMapApiState({
    name: "RepositoryDeployments",
    execute: (repositoryId: string) => new DeploymentApi().getAllDeploymentsFromRepository(repositoryId),
    cacheTimeout: 60
});

export {
    RepositoryDeploymentSlice,
    loadRepositoryDeployments,
    updateRepositoryDeployments
};
