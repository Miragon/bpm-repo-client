import * as api from "../../api/api";
import {UserInfoTO} from "../../api/api";
import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";

export const searchUsers = async (typedName: string): Promise<AxiosResponse<UserInfoTO[]>> => {
    const userController = new api.UserApi();
    const config = helpers.getClientConfig();
    const response = await userController.searchUsers(typedName, config);
    return response;
}
