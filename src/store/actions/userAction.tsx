import * as api from "../../api/api";
import helpers from "../../util/helperFunctions";

export const searchUsers = async (typedName: string) => {
    const userController = new api.UserApi();
    const config = helpers.getClientConfig();
    const response = await userController.searchUsers(typedName, config);
    return response;
}
