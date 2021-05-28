import {HANDLEDERROR, SUCCESS, UNHANDLEDERROR} from "../actions/diagramAction";
import {CaseReducer} from "@reduxjs/toolkit";

const initialState = {
    errorMessage: "",
    successMessage: ""
}


const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case HANDLEDERROR:
            return {
                ...state,
                errorMessage: action.errorMessage
            }
        case UNHANDLEDERROR:
            return {
                ...state,
                errorMessage: `Fehler ${action.errorMessage}`
            }
        case SUCCESS:
            return {
                ...state,
                successMessage: action.successMessage

            }
    }
    return state;
}
export default reducer;