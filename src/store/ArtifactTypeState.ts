import { ArtifactApi } from "../api";
import createListApiState from "./lib/ListApiState";

const [
    ArtifactTypeSlice,
    loadArtifactTypes,
    updateArtifactTypes
] = createListApiState({
    name: "ArtifactTypes",
    idKey: "fileExtension",
    execute: () => new ArtifactApi().getAllFileTypes(),
    cacheTimeout: 60
});

export {
    ArtifactTypeSlice,
    loadArtifactTypes,
    updateArtifactTypes
};
