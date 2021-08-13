import {createOrUpdateUserAssignment, deleteAssignment, getAllAssignedUsers} from "./assignmentAction";
import {
    addToFavorites, copyToRepo, createArtifact,
    deleteArtifact,
    fetchArtifactsFromRepo,
    fetchFavoriteArtifacts,
    fetchRecentArtifacts, getAllSharedArtifacts,
    searchArtifact, shareWithRepo,
    updateArtifact,
    uploadArtifact
} from "./artifactAction";
import {
    createRepository,
    deleteRepository,
    fetchRepositories,
    getSingleRepository,
    updateRepository
} from "./repositoryAction";
import {searchUsers} from "./userAction";
import {createOrUpdateVersion, getAllVersions, getLatestVersion} from "./versionAction";
import {deployVersion, fetchTargets} from "./deploymentAction";

export enum ActionType {
    FETCH_FAVORITE_ARTIFACTS,
    FETCH_RECENT_ARTIFACTS,
    CREATE_ARTIFACT,
    FETCH_ARTIFACTS_FROM_REPO,
    UPLOAD_DIAGRAM,
    DELETE_ARTIFACTS,
    FETCH_REPOSITORIES,
    GET_SINGLE_REPOSITORY,
    CREATE_REPOSITORY,
    SEARCH_USERS,
    CREATE_OR_UPDATE_VERSION,
    GET_ALL_VERSIONS,
    GET_ALL_ASSIGNED_USERS,
    CREATE_OR_UPDATE_USER_ASSIGNMENT,
    DELETE_ASSIGNMENT,
    UPDATE_REPOSITORY,
    DELETE_REPOSITORY,
    SEARCH_ARTIFACT,
    UPDATE_ARTIFACT,
    LATEST_VERSION,
    DEPLOY_VERSION,
    FETCH_MENU_ITEMS,
    FETCH_TARGETS,
    SET_STARRED,
    COPY_TO_REPO,
    SHARE_WITH_REPO,
    GET_SHARED_ARTIFACTS
}

// eslint-disable-next-line
export const actionMapper = (actionType: ActionType, payload: Array<any>) => {
    switch (actionType) {
        case ActionType.CREATE_ARTIFACT:
            return createArtifact(payload[0], payload[1], payload[2], payload[3], payload[4]);

        case ActionType.COPY_TO_REPO:
            return copyToRepo(payload[0], payload[1]);

        case ActionType.FETCH_FAVORITE_ARTIFACTS:
            return fetchFavoriteArtifacts();

        case ActionType.FETCH_RECENT_ARTIFACTS:
            return fetchRecentArtifacts();

        case ActionType.FETCH_ARTIFACTS_FROM_REPO:
            return fetchArtifactsFromRepo(payload[0]);

        case ActionType.UPLOAD_DIAGRAM:
            return uploadArtifact(payload[0], payload[1], payload[2], payload[3]);

        case ActionType.DELETE_ARTIFACTS:
            return deleteArtifact(payload[0]);

        case ActionType.FETCH_REPOSITORIES:
            return fetchRepositories();

        case ActionType.GET_SHARED_ARTIFACTS:
            return getAllSharedArtifacts();

        case ActionType.GET_SINGLE_REPOSITORY:
            return getSingleRepository(payload[0]);

        case ActionType.CREATE_REPOSITORY:
            return createRepository(payload[0], payload[1]);

        case ActionType.UPDATE_REPOSITORY:
            return updateRepository(payload[0], payload[1], payload[2]);

        case ActionType.SEARCH_USERS:
            return searchUsers(payload[0]);

        case ActionType.CREATE_OR_UPDATE_VERSION:
            return createOrUpdateVersion(payload[0], payload[1], payload[2], payload[3] ? payload[3] : "");

        case ActionType.GET_ALL_VERSIONS:
            return getAllVersions(payload[0]);

        case ActionType.GET_ALL_ASSIGNED_USERS:
            return getAllAssignedUsers(payload[0]);

        case ActionType.CREATE_OR_UPDATE_USER_ASSIGNMENT:
            return createOrUpdateUserAssignment(payload[0], payload[1], payload[2]);

        case ActionType.DELETE_ASSIGNMENT:
            return deleteAssignment(payload[0], payload[1]);

        case ActionType.DELETE_REPOSITORY:
            return deleteRepository(payload[0]);

        case ActionType.SHARE_WITH_REPO:
            return shareWithRepo(payload[0], payload[1]);

        case ActionType.SEARCH_ARTIFACT:
            return searchArtifact(payload[0]);

        case ActionType.UPDATE_ARTIFACT:
            return updateArtifact(payload[0], payload[1], payload[2]);

        case ActionType.LATEST_VERSION:
            return getLatestVersion(payload[0]);

        case ActionType.DEPLOY_VERSION:
            return deployVersion(payload[0], payload[1], payload[2]);

        case ActionType.FETCH_TARGETS:
            return fetchTargets();

        case ActionType.SET_STARRED:
            return addToFavorites(payload[0]);
    }
};
