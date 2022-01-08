import { ArtifactApi } from "../api";
import createListApiState from "./lib/ListApiState";

const [
    RecentArtifactSlice,
    loadRecentArtifacts,
    updateRecentArtifacts
] = createListApiState({
    name: "RecentArtifacts",
    idKey: "id",
    execute: () => new ArtifactApi().getRecent(),
    cacheTimeout: 60
});

export {
    RecentArtifactSlice,
    loadRecentArtifacts,
    updateRecentArtifacts
};
