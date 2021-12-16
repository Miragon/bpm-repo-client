import { CaseReducer } from "@reduxjs/toolkit";
import { TARGETS } from "../../constants/Constants";

const initialState = {
    targets: Array<string>(),
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case TARGETS:
            return {
                ...state,
                targets: action.targets
            };
    }
    return state;
};

export default reducer;
