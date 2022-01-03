import { ShareApi } from "../api";
import createMapApiState from "./lib/MapApiState";

const [
    SharedArtifactSlice,
    loadSharedArtifacts,
    updateSharedArtifacts
] = createMapApiState({
    name: "SharedArtifacts",
    execute: (repositoryId: string) => new ShareApi().getSharedArtifacts(repositoryId),
    cacheTimeout: 60
});

export {
    SharedArtifactSlice,
    loadSharedArtifacts,
    updateSharedArtifacts
};
