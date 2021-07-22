import {combineReducers} from "@reduxjs/toolkit";
import resultsCountReducer from "./queryResultsReducer";
import usersReducer from "./usersReducer";
import artifactReducer from "./artifactReducer";
import apiResponseReducer from "./apiResponseReducer";
import dataSyncedReducer from "./dataSyncedReducer";
import repoReducer from "./repositoriesReducer";
import versionsReducer from "./versionsReducer";
import menuReducer from "./menuReducer";
import deploymentReducer from "./deploymentReducer";

export const rootReducer = combineReducers({
    menuItems: menuReducer,
    repos: repoReducer,
    api: apiResponseReducer,
    dataSynced: dataSyncedReducer,
    artifacts: artifactReducer,
    versions: versionsReducer,
    user: usersReducer,
    resultsCount: resultsCountReducer,
    deployment: deploymentReducer
});

export type RootState = ReturnType<typeof rootReducer>;
