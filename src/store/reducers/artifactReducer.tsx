import {CaseReducer} from "@reduxjs/toolkit";
import {ArtifactTO, ArtifactTypeTO} from "../../api";
import {
    ACTIVE_ARTIFACTS,
    ARTIFACT_UPLOAD,
    FAVORITE_ARTIFACTS,
    FILETYPES,
    RECENT_ARTIFACTS,
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

    }
    return state;
};

export default reducer;
