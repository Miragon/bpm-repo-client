import {CaseReducer} from "@reduxjs/toolkit";
import {ArtifactTO, ArtifactTypeTO} from "../../api";
import {
    ACTIVE_ARTIFACTS, ARTIFACTS_REPO_AND_TYPE,
    DIAGRAM_UPLOAD,
    FILETYPES,
    GET_FAVORITE,
    GET_RECENT,
    SEARCH_ARTIFACT,
    SHARED_ARTIFACTS
} from "../constants";

const initialState = {
    artifacts: Array<ArtifactTO>(),
    createdArtifact: null,
    uploadedArtifact: null,
    recentArtifacts: Array<ArtifactTO>(),
    favoriteArtifacts: Array<ArtifactTO>(),
    searchedArtifacts: Array<ArtifactTO>(),
    fileTypes: Array<ArtifactTypeTO>(),
    sharedArtifacts: Array<ArtifactTO>(),
    artifactsByRepoAndType: Array<ArtifactTO>()
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

        case SHARED_ARTIFACTS:
            return {
                ...state,
                sharedArtifacts: action.sharedArtifacts
            }

        case ARTIFACTS_REPO_AND_TYPE:
            return {
                ...state,
                artifactsByRepoAndType: action.artifactsByRepoAndType
            }
    }
    return state;
};

export default reducer;
