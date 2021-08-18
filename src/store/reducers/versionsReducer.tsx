import {CaseReducer} from "@reduxjs/toolkit";
import {ArtifactVersionTO} from "../../api";
import {ACTIVE_VERSIONS, LATEST_VERSION} from "../../constants/Constants";

const initialState = {
    activeVersions: Array<ArtifactVersionTO>(),
    latestVersion: null,
    defaultVersionProps: null,
    versionProps: null
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVE_VERSIONS:
            return {
                ...state,
                activeVersions: action.activeVersions
            };
        case LATEST_VERSION:
            return {
                ...state,
                latestVersion: action.latestVersion
            }
    }
    return state;
};

export default reducer;
