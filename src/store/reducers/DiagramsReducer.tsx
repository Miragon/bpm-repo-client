import {CaseReducer} from "@reduxjs/toolkit";
import {DiagramTO, FileTypesTO} from "../../api/models";
import {ACTIVE_DIAGRAMS, DIAGRAM_UPLOAD, FILETYPES, GET_FAVORITE, GET_RECENT, SEARCH_DIAGRAMS} from "../constants";

const initialState = {
    diagrams: Array<DiagramTO>(),
    createdDiagram: null,
    uploadedDiagram: null,
    recentDiagrams: Array<DiagramTO>(),
    favoriteDiagrams: Array<DiagramTO>(),
    searchedDiagrams: Array<DiagramTO>(),
    fileTypes: Array<FileTypesTO>(),

};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVE_DIAGRAMS:
            return {
                ...state,
                diagrams: action.diagrams
            };
        case DIAGRAM_UPLOAD:
            return {
                ...state,
                uploadedDiagram: action.uploadedDiagram
            };
        case GET_RECENT:
            return {
                ...state,
                recentDiagrams: action.recentDiagrams
            };
        case GET_FAVORITE:
            return {
                ...state,
                favoriteDiagrams: action.favoriteDiagrams
            };
        case SEARCH_DIAGRAMS:
            return {
                ...state,
                searchedDiagrams: action.searchedDiagrams
            };
        case FILETYPES:
            return {
                ...state,
                fileTypes: action.fileTypes
            }
    }
    return state;
};

export default reducer;
