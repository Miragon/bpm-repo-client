import {BpmnRepositoryRequestTO} from "../../api/models";
import {GET_REPOS} from "../actions/repositoryAction";
import {CaseReducer} from "@reduxjs/toolkit";

const initialState = {
    repos: Array<BpmnRepositoryRequestTO>()
}

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REPOS:
            return {
                ...state,
                repos: action.repos
            }
    }
    return state;
}
export default reducer;