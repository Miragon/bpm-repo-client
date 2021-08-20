import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import helpers from "../../util/helperFunctions";
import {HANDLEDERROR, MENU_ITEMS, SYNC_STATUS_MENU} from "../../constants/Constants";
import {handleError} from "./errorAction";
import {ActionType} from "./actions";


export const fetchMenuItems = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const menuController = new api.MenuApi();
        try {
            const config = helpers.getClientConfig();
            const response = await menuController.getAllMenuItems(config);
            if(Math.floor(response.status / 100) === 2) {
                dispatch({type: MENU_ITEMS, menuItems: response.data})
                dispatch({type: SYNC_STATUS_MENU, dataSynced: true})
            } else{
                dispatch({type: HANDLEDERROR, errorMessage: "error.couldNotProcess"});
            }
        }
        catch (error) {
            dispatch(handleError(error, ActionType.FETCH_MENU_ITEMS, []));
        }
    }
}