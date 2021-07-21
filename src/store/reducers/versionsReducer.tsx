import {CaseReducer} from "@reduxjs/toolkit";
import {DiagramVersionTO} from "../../api/models";
import {CREATE_DEFAULT_VERSION, CREATE_VERSION_WITH_FILE, GET_VERSIONS, LATEST_VERSION} from "../constants";

const initialState = {
    versions: Array<DiagramVersionTO>(),
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
        case CREATE_DEFAULT_VERSION:
            return {
                ...state,
                defaultVersionProps: action.defaultVersionProps
            }
        case CREATE_VERSION_WITH_FILE:
            return {
                ...state,
                versionProps: action.versionProps
            }
    }
    return state;
};

export default reducer;
