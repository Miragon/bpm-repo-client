import {CaseReducer} from "@reduxjs/toolkit";
import {BpmnDiagramTO, BpmnRepositoryRequestTO} from "../../api/models";
import {ACTIVE_DIAGRAMS} from "../actions/repositoryAction";

const initialState = {
    activeDiagrams: Array<BpmnDiagramTO>()
}

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVE_DIAGRAMS:
            return {
                ...state,
                activeDiagrams: action.activeDiagrams
            }
    }
    return state;
}
export default reducer;