import { AxiosResponse } from "axios";
import { NewRepositoryTO, RepositoryApi, RepositoryTO, RepositoryUpdateTO } from "../../api";
import { getClientConfig } from "../../api/config";

export const fetchRepositories = async (): Promise<AxiosResponse<RepositoryTO[]>> => {
    const repositoryController = new RepositoryApi();
    const config = getClientConfig();
    return repositoryController.getAllRepositories(config);
};

export const getSingleRepository = async (id: string): Promise<AxiosResponse<RepositoryTO>> => {
    const repositoryController = new RepositoryApi();
    const config = getClientConfig();
    return repositoryController.getSingleRepository(id, config);
};

export const createRepository = async (name: string, description: string): Promise<AxiosResponse<RepositoryTO>> => {
    const repositoryController = new RepositoryApi();
    const config = getClientConfig();
    const newRepositoryTO: NewRepositoryTO = {
        name,
        description
    };
    return repositoryController.createRepository(newRepositoryTO, config);
};

export const updateRepository = async (id: string, name: string, description: string): Promise<AxiosResponse<RepositoryTO>> => {
    const repositoryController = new RepositoryApi();
    const config = getClientConfig();
    const repositoryUpdateTO: RepositoryUpdateTO = {
        name,
        description
    };
    return repositoryController.updateRepository(id, repositoryUpdateTO, config);
};

export const deleteRepository = async (id: string): Promise<AxiosResponse<void>> => {
    const repositoryController = new RepositoryApi();
    const config = getClientConfig();
    return repositoryController.deleteRepository(id, config);
};

export const getManageableRepos = async (): Promise<AxiosResponse<RepositoryTO[]>> => {
    const repositoryController = new RepositoryApi();
    const config = getClientConfig();
    return repositoryController.getManageableRepositories(config);
};

export const searchRepos = async (typedName: string): Promise<AxiosResponse<RepositoryTO[]>> => {
    const repositoryController = new RepositoryApi();
    const config = getClientConfig();
    return repositoryController.searchRepositories(typedName, config);
};
