import * as api from "../../api/api";
import helpers from "../../util/helperFunctions";


export const fetchMenuItems = async () => {
    const menuController = new api.MenuApi();
    const config = helpers.getClientConfig();
    const response = await menuController.getAllMenuItems(config);
    return response;
}
