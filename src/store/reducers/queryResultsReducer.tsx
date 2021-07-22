import {CaseReducer} from "@reduxjs/toolkit";
import {ARTIFACTQUERY_EXECUTED, USERQUERY_EXECUTED} from "../constants";

const initialState = {
    userResultsCount: 0,
    artifactResultsCount: 0
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case USERQUERY_EXECUTED:
            return {
                ...state,
                userResultsCount: action.userResultsCount
            };
        case ARTIFACTQUERY_EXECUTED:
            return {
                ...state,
                artifactResultsCount: action.artifactResultsCount

            }
    }
    return state;
};

export default reducer;
