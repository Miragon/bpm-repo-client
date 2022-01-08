import { RepositoryApi } from "../api";
import createListApiState from "./lib/ListApiState";

const [
    RepositorySlice,
    loadRepositories,
    updateRepositories
] = createListApiState({
    name: "Repositories",
    idKey: "id",
    execute: () => new RepositoryApi().getAllRepositories(),
    cacheTimeout: 60
});

export {
    RepositorySlice,
    loadRepositories,
    updateRepositories
};
