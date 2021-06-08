import {CaseReducer} from "@reduxjs/toolkit";
import {HANDLEDERROR, SUCCESS, UNHANDLEDERROR, UNHANDLEDERRORRETRY} from "../actions/diagramAction";
import {fetchRepositories} from "../actions/repositoryAction";

const initialState = {
    errorMessage: "",
    successMessage: "",
    retryMethod: fetchRepositories()
}

//#TODO this class is only for testing the retry Button (retryMethod has to be passed to the toast) - can be deleted later on
const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case UNHANDLEDERRORRETRY:
            return {
                ...state,
                errorMessage: action.errorMessage,
                retryMethod: action.retryMethod
            }

    }
    return state;
}
export default reducer;