import {CaseReducer} from "@reduxjs/toolkit";
import {AssignmentTO, UserInfoTO} from "../../api";
import {ASSIGNED_USERS, CURRENT_USER_INFO, SEARCHED_USERS} from "../../constants/Constants";

const initialState = {
    currentUserInfo: null,
    searchedUsers: Array<UserInfoTO>(),
    assignedUsers: Array<AssignmentTO>()
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case CURRENT_USER_INFO:
            return {
                ...state,
                currentUserInfo: action.currentUserInfo
            };
        case SEARCHED_USERS:
            return {
                ...state,
                searchedUsers: action.searchedUsers
            };
        case ASSIGNED_USERS:
            return {
                ...state,
                assignedUsers: action.assignedUsers
            };
    }
    return state;
};

export default reducer;
