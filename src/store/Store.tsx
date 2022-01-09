import { applyMiddleware, combineReducers, createStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import { ArtifactTypeSlice } from "./ArtifactTypeState";
import { DeploymentTargetsSlice } from "./DeploymentTargetState";
import { FavoriteArtifactSlice } from "./FavoriteArtifactState";
import { OwnRepositorySlice } from "./OwnRepositoryState";
import { RecentArtifactSlice } from "./RecentArtifactState";
import { RepositoryArtifactSlice } from "./RepositoryArtifactState";
import { RepositoryDeploymentSlice } from "./RepositoryDeploymentState";
import { RepositorySlice } from "./RepositoryState";
import { SharedArtifactSlice } from "./SharedArtifactState";
import { UserInfoSlice } from "./UserInfoState";

const rootReducer = combineReducers({
    artifactTypes: ArtifactTypeSlice.reducer,
    deploymentTargets: DeploymentTargetsSlice.reducer,
    favoriteArtifacts: FavoriteArtifactSlice.reducer,
    ownRepositories: OwnRepositorySlice.reducer,
    recentArtifacts: RecentArtifactSlice.reducer,
    repositories: RepositorySlice.reducer,
    repositoryArtifacts: RepositoryArtifactSlice.reducer,
    repositoryDeployments: RepositoryDeploymentSlice.reducer,
    sharedArtifacts: SharedArtifactSlice.reducer,
    userInfo: UserInfoSlice.reducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));

export type RootState = ReturnType<typeof rootReducer>;
export type RootDispatch = typeof store.dispatch;

export default store;
