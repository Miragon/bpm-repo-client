import {CaseReducer} from "@reduxjs/toolkit";
import {ArtifactTO, ArtifactTypeTO} from "../../api";
import {ACTIVE_ARTIFACTS, FAVORITE_ARTIFACTS, FILETYPES, SHARED_ARTIFACTS} from "../../constants/Constants";

const initialState = {
    artifacts: Array<ArtifactTO>(),
    favoriteArtifacts: Array<ArtifactTO>(),
    fileTypes: Array<ArtifactTypeTO>(),
    sharedArtifacts: Array<ArtifactTO>(),
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVE_ARTIFACTS:
            return {
                ...state,
                artifacts: action.artifacts
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
