import { ArtifactApi } from "../api";
import createMapApiState from "./lib/MapApiState";

const [
    RepositoryArtifactSlice,
    loadRepositoryArtifacts,
    updateRepositoryArtifacts
] = createMapApiState({
    name: "RepositoryArtifacts",
    execute: (repositoryId: string) => new ArtifactApi().getArtifactsFromRepo(repositoryId),
    cacheTimeout: 60
});

export {
    RepositoryArtifactSlice,
    loadRepositoryArtifacts,
    updateRepositoryArtifacts
};
