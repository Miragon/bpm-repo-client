import {BpmnDiagramTO} from "../../api/models";
import {GET_RECENT} from "../actions/diagramAction";
import {CaseReducer} from "@reduxjs/toolkit";


const initialState = {
    recentDiagrams: Array<BpmnDiagramTO>()
    //favoriteDiagrams: Array<BpmnDiagramTO>()
}
const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_RECENT:
            return {
                ...state,
                recentDiagrams: action.recentDiagrams
            }
    }
    return state;
}
export default reducer;