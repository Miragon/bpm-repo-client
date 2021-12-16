import { ArtifactTO, DeploymentTO } from "../api";

export const compareTimestamp = (a: DeploymentTO, b: DeploymentTO): number => {
    const c = new Date(a.timestamp);
    const d = new Date(b.timestamp);
    if (c < d) {
        return 1;
    }
    if (c > d) {
        return -1;
    }
    return 0;
};

export const compareCreated = (a: ArtifactTO, b: ArtifactTO): number => {
    const c = new Date(a.createdDate);
    const d = new Date(b.createdDate);
    if (c < d) {
        return 1;
    }
    if (c > d) {
        return -1;
    }
    return 0;
};

export const compareEdited = (a: ArtifactTO, b: ArtifactTO): number => {
    const c = new Date(a.updatedDate);
    const d = new Date(b.updatedDate);
    if (c < d) {
        return 1;
    }
    if (c > d) {
        return -1;
    }
    return 0;
};
export const compareName = (a: ArtifactTO, b: ArtifactTO): number => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
    }
    return 0;
};
