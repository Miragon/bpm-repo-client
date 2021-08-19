import {CaseReducer} from "@reduxjs/toolkit";
import {ArtifactTO, ArtifactTypeTO} from "../../api";
import {
    ACTIVE_ARTIFACTS,
    ARTIFACT_UPLOAD,
    ARTIFACTS_BY_REPO_AND_TYPE,
    FAVORITE_ARTIFACTS,
    FILETYPES,
    RECENT_ARTIFACTS,
    SEARCHED_ARTIFACTS,
    SHARED_ARTIFACTS
} from "../../constants/Constants";

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
        case ARTIFACT_UPLOAD:
            return {
                ...state,
                uploadedArtifact: action.uploadedArtifact
            };
        case RECENT_ARTIFACTS:
            return {
                ...state,
                recentArtifacts: action.recentArtifacts
            };
        case FAVORITE_ARTIFACTS:
            return {
                ...state,
                favoriteArtifacts: action.favoriteArtifacts
            };
        case SEARCHED_ARTIFACTS:
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

        case ARTIFACTS_BY_REPO_AND_TYPE:
            return {
                ...state,
                artifactsByRepoAndType: action.artifactsByRepoAndType
            }
    }
    return state;
};

export default reducer;
