import {combineReducers} from "@reduxjs/toolkit";
import { ArtifactTypeSlice } from "../ArtifactTypeState";
import { DeploymentTargetsSlice } from "../DeploymentTargetState";
import { FavoriteArtifactSlice } from "../FavoriteArtifactState";
import { OwnRepositorySlice } from "../OwnRepositoryState";
import { RecentArtifactSlice } from "../RecentArtifactState";
import { RepositoryArtifactSlice } from "../RepositoryArtifactState";
import { RepositoryDeploymentSlice } from "../RepositoryDeploymentState";
import { RepositorySlice } from "../RepositoryState";
import { SharedArtifactSlice } from "../SharedArtifactState";
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
    repositoryArtifacts: RepositoryArtifactSlice.reducer,
    deploymentTargets: DeploymentTargetsSlice.reducer,
    ownRepositories: OwnRepositorySlice.reducer,
    sharedArtifacts: SharedArtifactSlice.reducer,
    repositoryDeployments: RepositoryDeploymentSlice.reducer,
    repos: repoReducer,
    dataSynced: dataSyncedReducer,
    artifacts: artifactReducer,
    milestones: milestonesReducer,
    user: usersReducer,
    deployment: deploymentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
