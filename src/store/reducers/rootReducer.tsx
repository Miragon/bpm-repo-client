import {combineReducers} from "@reduxjs/toolkit";
import { ArtifactTypeSlice } from "../ArtifactTypeState";
import { FavoriteArtifactSlice } from "../FavoriteArtifactState";
import { RecentArtifactSlice } from "../RecentArtifactState";
import { RepositorySlice } from "../RepositoryState";
import usersReducer from "./usersReducer";
import artifactReducer from "./artifactReducer";
import dataSyncedReducer from "./dataSyncedReducer";
import repoReducer from "./repositoriesReducer";
import milestonesReducer from "./milestonesReducer";
import deploymentReducer from "./deploymentReducer";

export const rootReducer = combineReducers({
    repositories: RepositorySlice.reducer,
    favoriteArtifacts: FavoriteArtifactSlice.reducer,
    recentArtifacts: RecentArtifactSlice.reducer,
    artifactTypes: ArtifactTypeSlice.reducer,
    repos: repoReducer,
    dataSynced: dataSyncedReducer,
    artifacts: artifactReducer,
    milestones: milestonesReducer,
    user: usersReducer,
    deployment: deploymentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
