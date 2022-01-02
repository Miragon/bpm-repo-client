import { RepositoryApi } from "../api";
import createListApiState from "./lib/ListApiState";

const [
    OwnRepositorySlice,
    loadOwnRepositories,
    updateOwnRepositories
] = createListApiState({
    name: "OwnRepositories",
    idKey: "id",
    execute: () => new RepositoryApi().getManageableRepositories(),
    cacheTimeout: 60
});

export {
    OwnRepositorySlice,
    loadOwnRepositories,
    updateOwnRepositories
};
