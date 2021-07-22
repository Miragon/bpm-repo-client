import {CaseReducer} from "@reduxjs/toolkit";
import {ArtifactTO, FileTypesTO} from "../../api/models";
import {ACTIVE_ARTIFACTS, DIAGRAM_UPLOAD, FILETYPES, GET_FAVORITE, GET_RECENT, SEARCH_ARTIFACT} from "../constants";

const initialState = {
    artifacts: Array<ArtifactTO>(),
    createdArtifact: null,
    uploadedArtifact: null,
    recentArtifacts: Array<ArtifactTO>(),
    favoriteArtifacts: Array<ArtifactTO>(),
    searchedArtifacts: Array<ArtifactTO>(),
    fileTypes: Array<FileTypesTO>(),

};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVE_ARTIFACTS:
            return {
                ...state,
                artifacts: action.artifacts
            };
        case DIAGRAM_UPLOAD:
            return {
                ...state,
                uploadedArtifact: action.uploadedArtifact
            };
        case GET_RECENT:
            return {
                ...state,
                recentArtifacts: action.recentArtifacts
            };
        case GET_FAVORITE:
            return {
                ...state,
                favoriteArtifacts: action.favoriteArtifacts
            };
        case SEARCH_ARTIFACT:
            return {
                ...state,
                searchedArtifacts: action.searchedArtifacts
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
