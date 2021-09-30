import {combineReducers} from "@reduxjs/toolkit";
import usersReducer from "./usersReducer";
import artifactReducer from "./artifactReducer";
import dataSyncedReducer from "./dataSyncedReducer";
import repoReducer from "./repositoriesReducer";
import versionsReducer from "./versionsReducer";
import deploymentReducer from "./deploymentReducer";
import teamReducer from "./teamReducer";

export const rootReducer = combineReducers({
    repos: repoReducer,
    dataSynced: dataSyncedReducer,
    artifacts: artifactReducer,
    versions: versionsReducer,
    user: usersReducer,
    deployment: deploymentReducer,
    team: teamReducer
});

export type RootState = ReturnType<typeof rootReducer>;
