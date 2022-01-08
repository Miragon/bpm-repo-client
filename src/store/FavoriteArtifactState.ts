import { ArtifactApi } from "../api";
import createListApiState from "./lib/ListApiState";

const [
    FavoriteArtifactSlice,
    loadFavoriteArtifacts,
    updateFavoriteArtifacts
] = createListApiState({
    name: "FavoriteArtifacts",
    idKey: "id",
    execute: () => new ArtifactApi().getStarred(),
    cacheTimeout: 60
});

export {
    FavoriteArtifactSlice,
    loadFavoriteArtifacts,
    updateFavoriteArtifacts
};
