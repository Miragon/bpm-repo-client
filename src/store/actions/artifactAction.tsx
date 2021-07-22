import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {
    ArtifactUpdateTO,
    ArtifactVersionUploadTO,
    ArtifactVersionUploadTOSaveTypeEnum,
    NewArtifactTO
} from "../../api/models";
import helpers from "../../constants/Functions";
import {
    ACTIVE_ARTIFACTS,
    DIAGRAM_UPLOAD,
    ARTIFACTQUERY_EXECUTED,
    GET_FAVORITE,
    GET_RECENT,
    SEARCH_ARTIFACT,
    SUCCESS,
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY,
    SYNC_STATUS_VERSION,
    UNHANDLEDERROR
} from "../constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const fetchFavoriteArtifacts = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.getStarred(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: GET_FAVORITE, favoriteArtifacts: response.data });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_FAVORITE_ARTIFACTS, []));
        }
    };
};

export const fetchRecentArtifacts = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.getRecent(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: GET_RECENT, recentArtifacts: response.data });
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: true})

            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_RECENT_ARTIFACTS, []));
        }
    };
};

export const createArtifact = (
    repoId: string,
    name: string,
    description: string,
    fileType: string,
    svgPreview: string
) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const newArtifactTO: NewArtifactTO = {
                name: name,
                description: description,
                fileType: fileType || "BPMN",
                svgPreview: svgPreview
            };
            const response = await artifactController.createArtifact(newArtifactTO, repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_ARTIFACT, [
                repoId, name, description, fileType, svgPreview
            ]));
        }
    };
};


export const createArtifactWithDefaultVersion = (repoId: string, name: string, description: string, file: string, fileType: string, svgPreview: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const newArtifactTO: NewArtifactTO = {
                name: name,
                description: description,
                //#TODO remove "BPMN"
                fileType: fileType || "BPMN",
                svgPreview: svgPreview
            };

            await artifactController.createArtifact(newArtifactTO, repoId, config)
                .then(response => {
                    if (Math.floor(response.status / 100) === 2) {
                        const artifactVersionUploadTO: ArtifactVersionUploadTO = {
                            saveType: ArtifactVersionUploadTOSaveTypeEnum.MILESTONE,
                            xml: file
                        }
                        const versionController = new api.VersionApi();
                        try {
                            const config = helpers.getClientConfig();
                            versionController.createOrUpdateVersion(artifactVersionUploadTO, response.data.id, config)
                                .then(response2 => {
                                    if (Math.floor(response2.status / 100) === 2) {
                                        dispatch({type: SUCCESS, successMessage: "artifact.createdDefault"});
                                        dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                                        dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false});
                                        dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                                        dispatch({type: SYNC_STATUS_VERSION, dataSynced: false});
                                    } else {
                                        dispatch({type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess"});
                                    }
                                }
                                );
                        } catch (error) {
                            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_VERSION, [response.data.id, file, ArtifactVersionUploadTOSaveTypeEnum.MILESTONE]));
                        }

                    } else {
                        dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
                    }
                });



        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_ARTIFACT, [
                repoId, name, description, fileType, svgPreview
            ]));
        }
    };
};




export const createNewArtifactWithVersionFile = (repoId: string, name: string, description: string, file: string, fileType: string, svgPreview: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const newArtifactTO: NewArtifactTO = {
                name: name,
                description: description,
                fileType: fileType || "BPMN",
                svgPreview: svgPreview
            };
            await artifactController.createArtifact(newArtifactTO, repoId, config)
                .then(response => {
                    if (Math.floor(response.status / 100) === 2) {
                        const artifactVersionUploadTO: ArtifactVersionUploadTO = {
                            saveType: ArtifactVersionUploadTOSaveTypeEnum.MILESTONE,
                            xml: file
                        }
                        const versionController = new api.VersionApi();
                        try {
                            const config = helpers.getClientConfig();
                            versionController.createOrUpdateVersion(artifactVersionUploadTO, response.data.id, config)
                                .then(response2 => {
                                    if (Math.floor(response2.status / 100) === 2) {
                                        dispatch({type: SUCCESS, successMessage: "artifact.createdFromExisting"});
                                        dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                                        dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false})
                                        dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                                        dispatch({type: SYNC_STATUS_VERSION, dataSynced: false});
                                    } else {
                                        dispatch({type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess"});
                                    }
                                }
                                );
                        } catch (error) {
                            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_VERSION, [response.data.id, file, ArtifactVersionUploadTOSaveTypeEnum.MILESTONE]));
                        }
                    } else {
                        dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
                    }
                });


        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_ARTIFACT, [
                repoId, name, description, fileType, svgPreview
            ]));
        }
    };
};


export const updateArtifact = (name: string, description: string | undefined, artifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            // eslint-disable-next-line object-shorthand
            const artifactUpdateTO: ArtifactUpdateTO = {
                name: name,
                description: description
            }
            const response = await artifactController.updateArtifact(artifactUpdateTO, artifactId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false})
                dispatch({ type: SUCCESS, successMessage: "artifact.updated" });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_ARTIFACTS_FROM_REPO, [name, description]));
        }
    };
};

export const fetchArtifactsFromRepo = (repoId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.getArtifactsFromRepo(repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ACTIVE_ARTIFACTS, artifacts: response.data });
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_ARTIFACTS_FROM_REPO, [repoId]));
        }
    };
};

export const uploadArtifact = (repoId: string, name: string, description: string, fileType: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const newArtifact: NewArtifactTO = {name, description, fileType};
            const config = helpers.getClientConfig();
            const response = await artifactController.createArtifact(newArtifact, repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: DIAGRAM_UPLOAD, uploadedArtifact: response.data });
                dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false})
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.UPLOAD_DIAGRAM, [repoId, name, description, fileType]));
        }
    };
};

export const searchArtifact = (typedTitle: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.searchArtifacts(typedTitle, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SEARCH_ARTIFACT, searchedArtifacts: response.data });
                dispatch({type: ARTIFACTQUERY_EXECUTED, artifactResultsCount: response.data.length})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.SEARCH_ARTIFACT, [typedTitle]));
        }
    };
};

export const deleteArtifact = (artifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new api.ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.deleteArtifact(artifactId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.DELETE_ARTIFACTS, [artifactId]));
        }
    };
};
