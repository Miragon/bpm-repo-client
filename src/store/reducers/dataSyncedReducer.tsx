import {CaseReducer} from "@reduxjs/toolkit";
import {
    SYNC_STATUS_ACTIVE_REPOSITORY,
    SYNC_STATUS_ACTIVE_TEAM,
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_ASSIGNMENT,
    SYNC_STATUS_FAVORITE,
    SYNC_STATUS_MENU,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY,
    SYNC_STATUS_SHARED,
    SYNC_STATUS_TARGETS,
    SYNC_STATUS_TEAM,
    SYNC_STATUS_VERSION
} from "../../constants/Constants";

const initialState = {
    repoSynced: false,
    activeRepoSynced: false,
    recentSynced: false,
    artifactSynced: false,
    versionSynced: undefined,
    assignmentSynced: false,
    menuSynced: false,
    sharedSynced: false,
    targetsSynced: false,
    teamSynced: false
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case SYNC_STATUS_REPOSITORY:
            return {
                ...state,
                repoSynced: action.dataSynced
            };

        case SYNC_STATUS_TEAM:
            return {
                ...state,
                teamSynced: action.dataSynced
            }

        case SYNC_STATUS_ACTIVE_TEAM:
            return {
                ...state,
                activeTeamSynced: action.dataSynced
            }

        case SYNC_STATUS_TARGETS:
            return {
                ...state,
                targetsSynced: action.targetsSynced
            }

        case SYNC_STATUS_ACTIVE_REPOSITORY:
            return {
                ...state,
                activeRepoSynced: action.dataSynced
            }

        case SYNC_STATUS_RECENT:
            return {
                ...state,
                recentSynced: action.dataSynced
            }

        case SYNC_STATUS_FAVORITE:
            return {
                ...state,
                favoriteSynced: action.dataSynced
            }

        case SYNC_STATUS_ARTIFACT:
            return {
                ...state,
                artifactSynced: action.dataSynced
            };

        case SYNC_STATUS_VERSION:
            return {
                ...state,
                versionSynced: action.dataSynced
            };

        case SYNC_STATUS_ASSIGNMENT:
            return {
                ...state,
                assignmentSynced: action.dataSynced
            };

        case SYNC_STATUS_MENU:
            return {
                ...state,
                menuSynced: action.dataSynced
            };

        case SYNC_STATUS_SHARED:
            return {
                ...state,
                sharedSynced: action.sharedSynced
            }
    }
    return state;
};

export default reducer;
