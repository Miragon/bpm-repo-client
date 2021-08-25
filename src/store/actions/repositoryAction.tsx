import {NewRepositoryTO, RepositoryApi, RepositoryUpdateTO} from "../../api";
import helpers from "../../util/helperFunctions";

export const fetchRepositories = async () => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.getAllRepositories(config);
    return response;
}

export const getSingleRepository = async (id: string) => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.getSingleRepository(id, config);
    return response
}



export const createRepository = async (name: string, description: string) => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const newRepositoryTO: NewRepositoryTO = {
        name,
        description
    };
    const response = await repositoryController.createRepository(newRepositoryTO, config);
    return response;
}

export const updateRepository = async (id: string, name: string, description: string) => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const repositoryUpdateTO: RepositoryUpdateTO = {
        name,
        description
    };
    const response = await repositoryController.updateRepository(id, repositoryUpdateTO, config);
    return response;
}

export const deleteRepository = async (id: string) => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.deleteRepository(id, config);
    return response;
}


export const getManageableRepos = async () => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.getManageableRepositories(config);
    return response;
}


export const searchRepos = async (typedName: string) => {
    const repositoryController = new RepositoryApi();
    const config = helpers.getClientConfig();
    const response = await repositoryController.searchRepositories(typedName, config);
    return response;
}
