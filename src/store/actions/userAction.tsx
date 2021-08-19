import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import helpers from "../../constants/Functions";
import {HANDLEDERROR, SEARCHED_USERS, USERQUERY_EXECUTED} from "../../constants/Constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const searchUsers = (typedName: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const userController = new api.UserApi();
        try {
            const config = helpers.getClientConfig();
            const response = await userController.searchUsers(typedName, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SEARCHED_USERS, searchedUsers: response.data });
                dispatch({ type: USERQUERY_EXECUTED, userResultsCount: response.data.length });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.SEARCH_USERS, [typedName]));
        }
    };
};
