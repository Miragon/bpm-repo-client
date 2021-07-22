import {CaseReducer} from "@reduxjs/toolkit";
import {ArtifactVersionTO} from "../../api/models";
import {GET_VERSIONS, LATEST_VERSION} from "../constants";

const initialState = {
    versions: Array<ArtifactVersionTO>(),
    latestVersion: null,
    defaultVersionProps: null,
    versionProps: null
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_VERSIONS:
            return {
                ...state,
                versions: action.versions
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
