import {CaseReducer} from "@reduxjs/toolkit";
import {ArtifactVersionTO} from "../../api";
import {ACTIVE_VERSIONS, DEPLOYMENT_VERSIONS, LATEST_VERSION} from "../../constants/Constants";

const initialState = {
    activeVersions: Array<ArtifactVersionTO>(),
    latestVersion: null,
    deploymentVersions: Array<Array<ArtifactVersionTO>>()
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

        case DEPLOYMENT_VERSIONS:
            return {
                ...state,
                deploymentVersions: [...state.deploymentVersions, action.deploymentVersions]

            }
    }
    return state;
};

export default reducer;
