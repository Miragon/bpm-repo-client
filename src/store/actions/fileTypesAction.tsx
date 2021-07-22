import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import helpers from "../../constants/Functions";
import {FILETYPES, UNHANDLEDERROR} from "../constants";
import {handleError} from "./errorAction";
import {ActionType} from "./actions";

export const fetchFileTypes = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const menuController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const response = await menuController.getAllFileTypes(config);
            if(Math.floor(response.status / 100) === 2) {
                dispatch({type: FILETYPES, fileTypes: response.data})
            } else{
                dispatch({type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess"});
            }
        }
        catch (error) {
            dispatch(handleError(error, ActionType.FETCH_MENU_ITEMS, []));
        }
    }
}