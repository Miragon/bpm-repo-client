import * as api from "../../api/api";
import {MenuItemTO} from "../../api/api";
import helpers from "../../util/helperFunctions";
import {AxiosResponse} from "axios";


export const fetchMenuItems = async (): Promise<AxiosResponse<MenuItemTO[]>> => {
    const menuController = new api.MenuApi();
    const config = helpers.getClientConfig();
    const response = await menuController.getAllMenuItems(config);
    return response;
}
