import { DeploymentApi } from "../api";
import createListApiState from "./lib/ListApiState";

const [
    DeploymentTargetsSlice,
    loadDeploymentTargets,
] = createListApiState({
    name: "DeploymentTargets",
    // Not required
    idKey: "anchor",
    execute: () => new DeploymentApi().getAllDeploymentTargets(),
    cacheTimeout: 60
});

export {
    DeploymentTargetsSlice,
    loadDeploymentTargets,
};
