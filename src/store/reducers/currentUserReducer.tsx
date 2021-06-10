import {CaseReducer} from "@reduxjs/toolkit";
import {CURRENT_USER_INFO} from "../actions/diagramAction";

const initialState = {
    currentUserInfo: null
}

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case CURRENT_USER_INFO:
            return {
                ...state,
                currentUserInfo: action.currentUserInfo
            }
    }
    return state;
}
export default reducer;