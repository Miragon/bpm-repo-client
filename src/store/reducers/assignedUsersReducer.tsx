import {CaseReducer} from "@reduxjs/toolkit";
import {ACTIVE_REPO} from "../actions/repositoryAction";
import {UserInfoTO} from "../../api/models";
import {ASSIGNED_USERS} from "../actions/diagramAction";
import {AssignmentTO} from "../../api/models/assignment-to";

const initialState = {
    assignedUsers: Array<AssignmentTO>()
}

const reducer: CaseReducer = (state= initialState, action) => {
    switch (action.type) {
        case ASSIGNED_USERS:
            return {
                ...state,
                assignedUsers: action.assignedUsers
            }
    }
    return state;
}
export default reducer;