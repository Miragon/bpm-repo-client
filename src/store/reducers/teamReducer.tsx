import {TeamTO} from "../../api";
import {CaseReducer} from "@reduxjs/toolkit";
import {ACTIVE_TEAM, TEAMS} from "../../constants/Constants";


const initialState = {
    teams: Array<TeamTO>(),
    activeTeam: null,
}

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case TEAMS:
            return {
                ...state,
                teams: action.teams
            }

        case ACTIVE_TEAM:
            return {
                ...state,
                activeTeam: action.activeTeam
            }
    }
    return state;
};

export default reducer;