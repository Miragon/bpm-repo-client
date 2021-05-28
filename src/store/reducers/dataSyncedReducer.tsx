import {CaseReducer} from "@reduxjs/toolkit";
import {SYNC_STATUS} from "../actions/diagramAction";

const initialState = {
    dataSynced: true
}


const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case SYNC_STATUS:
            return {
                ...state,
                dataSynced: action.dataSynced
            }
    }
    return state;
}
export default reducer;