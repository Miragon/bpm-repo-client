import {NewRepositoryTO, RepositoryApi, RepositoryTO, RepositoryUpdateTO} from "../../api";
import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";

export const fetchRepositories = async (): Promise<AxiosResponse<RepositoryTO[]>> => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.getAllRepositories(config);
    return response;
}

export const getSingleRepository = async (id: string): Promise<AxiosResponse<RepositoryTO>> => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.getSingleRepository(id, config);
    return response
}


export const getAllRepositoriesForTeam = async(teamId: string): Promise<AxiosResponse<Array<RepositoryTO>>> => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.getAllAssignedRepositories(teamId, config);
    return response
}


export const createRepository = async (name: string, description: string): Promise<AxiosResponse<RepositoryTO>> => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const newRepositoryTO: NewRepositoryTO = {
        name,
        description
    };
    const response = await repositoryController.createRepository(newRepositoryTO, config);
    return response;
}

export const updateRepository = async (id: string, name: string, description: string): Promise<AxiosResponse<RepositoryTO>> => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const repositoryUpdateTO: RepositoryUpdateTO = {
        name,
        description
    };
    const response = await repositoryController.updateRepository(id, repositoryUpdateTO, config);
    return response;
}

export const deleteRepository = async (id: string): Promise<AxiosResponse<void>> => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.deleteRepository(id, config);
    return response;
}


export const getManageableRepos = async (): Promise<AxiosResponse<RepositoryTO[]>> => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.getManageableRepositories(config);
    return response;
}


export const searchRepos = async (typedName: string): Promise<AxiosResponse<RepositoryTO[]>> => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.searchRepositories(typedName, config);
    return response;
}
