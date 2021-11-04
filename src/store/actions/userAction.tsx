import * as api from "../../api/api";
import {UserInfoTO} from "../../api";
import {AxiosResponse} from "axios";
import {getClientConfig} from "../../api/config";

export const searchUsers = async (typedName: string): Promise<AxiosResponse<UserInfoTO[]>> => {
    const userController = new api.UserApi();
    const config = getClientConfig();
    return await userController.searchUsers(typedName, config);
}

export const getMultipleUsers = async (userIds: Array<string>): Promise<AxiosResponse<UserInfoTO[]>> => {
    const userController = new api.UserApi();
    const config = getClientConfig();
    return await userController.getMultipleUsers(userIds, config);
}