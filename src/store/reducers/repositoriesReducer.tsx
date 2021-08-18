import {CaseReducer} from "@reduxjs/toolkit";
import {RepositoryTO} from "../../api";
import {ACTIVE_REPO, REPOSITORIES} from "../../constants/Constants";

const initialState = {
    repos: Array<RepositoryTO>(),
    activeRepo: null

};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case REPOSITORIES:
            return {
                ...state,
                repos: action.repos
            };
        case ACTIVE_REPO:
            return {
                ...state,
                activeRepo: action.activeRepo
            };
    }
    return state;
};

export default reducer;
