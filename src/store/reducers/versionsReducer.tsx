import {BpmnDiagramVersionTO} from "../../api/models";
import {CaseReducer} from "@reduxjs/toolkit";
import {GET_VERSIONS} from "../actions/diagramAction";

const initialState = {
    versions: Array<BpmnDiagramVersionTO>()
}

const reducer: CaseReducer = (state = initialState, action) => {
switch (action.type) {
    case GET_VERSIONS:
        return {
            ...state,
            versions: action.versions
        }
    }
    return state;
}
export default reducer;