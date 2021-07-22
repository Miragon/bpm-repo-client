import {CaseReducer} from "@reduxjs/toolkit";
import {ActionType} from "../actions/actions";
import {SUCCESS, UNHANDLEDERROR} from "../constants";

const initialState = {
    errorMessage: "",
    errorMessageWithVariables: {},
    successMessage: "",
    successMessageWithVariables: {},
    retryMethod: ActionType,
    retryPayload: [],
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case UNHANDLEDERROR:
            return {
                ...state,
                errorMessage: action.errorMessage,
                errorMessageWithVariables: action.errorMessageWithVariables,
                retryMethod: action.retryMethod,
                retryPayload: action.retryPayload
            };
        case SUCCESS:
            return {
                ...state,
                successMessage: action.successMessage,
                successMessageWithVariables: action.successMessageWithVariables
            };
    }
    return state;
};

export default reducer;
