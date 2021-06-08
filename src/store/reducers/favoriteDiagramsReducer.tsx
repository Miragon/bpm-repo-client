import {GET_FAVORITE} from "../actions/diagramAction";
import {BpmnDiagramTO} from "../../api/models";
import {CaseReducer} from "@reduxjs/toolkit";

const initialState = {
    favoriteDiagrams: Array<BpmnDiagramTO>()
}


const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_FAVORITE:
            return {
                ...state,
                favoriteDiagrams: action.favoriteDiagrams
            }
    }
    return state;
}
export default reducer;