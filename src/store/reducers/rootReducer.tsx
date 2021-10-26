import {combineReducers} from "@reduxjs/toolkit";
import usersReducer from "./usersReducer";
import artifactReducer from "./artifactReducer";
import dataSyncedReducer from "./dataSyncedReducer";
import repoReducer from "./repositoriesReducer";
import milestonesReducer from "./milestonesReducer";
import deploymentReducer from "./deploymentReducer";

export const rootReducer = combineReducers({
    repos: repoReducer,
    dataSynced: dataSyncedReducer,
    artifacts: artifactReducer,
    milestones: milestonesReducer,
    user: usersReducer,
    deployment: deploymentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
