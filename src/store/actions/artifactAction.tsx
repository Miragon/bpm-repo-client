import {Dispatch} from "@reduxjs/toolkit";
import {
    ArtifactApi,
    ArtifactUpdateTO,
    ArtifactVersionUploadTO,
    ArtifactVersionUploadTOSaveTypeEnum,
    NewArtifactTO, VersionApi
} from "../../api";
import helpers from "../../constants/Functions";
import {
    ACTIVE_ARTIFACTS,
    ARTIFACTQUERY_EXECUTED,
    ARTIFACTS_BY_REPO_AND_TYPE,
    ARTIFACT_UPLOAD,
    FAVORITE_ARTIFACTS,
    RECENT_ARTIFACTS,
    SEARCHED_ARTIFACTS,
    SHARED_ARTIFACTS,
    SUCCESS,
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_FAVORITE,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY,
    SYNC_STATUS_VERSION,
    HANDLEDERROR
} from "../../constants/Constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const fetchFavoriteArtifacts = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.getStarred(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: FAVORITE_ARTIFACTS, favoriteArtifacts: response.data });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_FAVORITE_ARTIFACTS, []));
        }
    };
};

export const fetchRecentArtifacts = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.getRecent(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: RECENT_ARTIFACTS, recentArtifacts: response.data });
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: true})

            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
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
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const newArtifactTO: NewArtifactTO = {
                name: name,
                description: description,
                fileType: fileType || "BPMN",
                svgPreview: svgPreview
            };
            const response = await artifactController.createArtifact(repoId, newArtifactTO, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
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
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const newArtifactTO: NewArtifactTO = {
                name: name,
                description: description,
                //#TODO remove "BPMN"
                fileType: fileType || "BPMN",
                svgPreview: svgPreview
            };

            await artifactController.createArtifact(repoId, newArtifactTO, config)
                .then(response => {
                    if (Math.floor(response.status / 100) === 2) {
                        const artifactVersionUploadTO: ArtifactVersionUploadTO = {
                            saveType: ArtifactVersionUploadTOSaveTypeEnum.Milestone,
                            xml: file
                        }
                        const versionController = new VersionApi();
                        try {
                            const config = helpers.getClientConfig();
                            versionController.createOrUpdateVersion(response.data.id, artifactVersionUploadTO, config)
                                .then(response2 => {
                                    if (Math.floor(response2.status / 100) === 2) {
                                        dispatch({type: SUCCESS, successMessage: "artifact.createdDefault"});
                                        dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                                        dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false});
                                        dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                                        dispatch({type: SYNC_STATUS_VERSION, dataSynced: false});
                                    } else {
                                        dispatch({type: HANDLEDERROR, errorMessage: "error.couldNotProcess"});
                                    }
                                }
                                );
                        } catch (error) {
                            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_VERSION, [response.data.id, file, ArtifactVersionUploadTOSaveTypeEnum.Milestone]));
                        }

                    } else {
                        dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
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
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const newArtifactTO: NewArtifactTO = {
                name: name,
                description: description,
                fileType: fileType || "BPMN",
                svgPreview: svgPreview
            };
            await artifactController.createArtifact(repoId, newArtifactTO, config)
                .then(response => {
                    if (Math.floor(response.status / 100) === 2) {
                        const artifactVersionUploadTO: ArtifactVersionUploadTO = {
                            saveType: ArtifactVersionUploadTOSaveTypeEnum.Milestone,
                            xml: file
                        }
                        const versionController = new VersionApi();
                        try {
                            const config = helpers.getClientConfig();
                            versionController.createOrUpdateVersion(response.data.id, artifactVersionUploadTO, config)
                                .then(response2 => {
                                    if (Math.floor(response2.status / 100) === 2) {
                                        dispatch({type: SUCCESS, successMessage: "artifact.createdFromExisting"});
                                        dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                                        dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false})
                                        dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                                        dispatch({type: SYNC_STATUS_VERSION, dataSynced: false});
                                    } else {
                                        dispatch({type: HANDLEDERROR, errorMessage: "error.couldNotProcess"});
                                    }
                                }
                                );
                        } catch (error) {
                            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_VERSION, [response.data.id, file, ArtifactVersionUploadTOSaveTypeEnum.Milestone]));
                        }
                    } else {
                        dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
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
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            // eslint-disable-next-line object-shorthand
            const artifactUpdateTO: ArtifactUpdateTO = {
                name: name,
                description: description ? description : ""
            }
            const response = await artifactController.updateArtifact(artifactId, artifactUpdateTO, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false})
                dispatch({ type: SUCCESS, successMessage: "artifact.updated" });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_ARTIFACTS_FROM_REPO, [name, description]));
        }
    };
};

export const fetchArtifactsFromRepo = (repoId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.getArtifactsFromRepo(repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ACTIVE_ARTIFACTS, artifacts: response.data });
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_ARTIFACTS_FROM_REPO, [repoId]));
        }
    };
};

export const uploadArtifact = (repoId: string, name: string, description: string, fileType: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const newArtifact: NewArtifactTO = {name, description, fileType};
            const config = helpers.getClientConfig();
            const response = await artifactController.createArtifact(repoId, newArtifact, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ARTIFACT_UPLOAD, uploadedArtifact: response.data });
                dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false})
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.UPLOAD_DIAGRAM, [repoId, name, description, fileType]));
        }
    };
};

export const searchArtifact = (typedTitle: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.searchArtifacts(typedTitle, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SEARCHED_ARTIFACTS, searchedArtifacts: response.data });
                dispatch({type: ARTIFACTQUERY_EXECUTED, artifactResultsCount: response.data.length})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.SEARCH_ARTIFACT, [typedTitle]));
        }
    };
};


export const addToFavorites = (artifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.setStarred(artifactId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                dispatch({type: SYNC_STATUS_FAVORITE, dataSynced: false})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.SET_STARRED, [artifactId]));
        }
    };
};

export const copyToRepo = (repositoryId: string, artifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.copyToRepository(repositoryId, artifactId, config);
            if(Math.floor(response.status / 100) === 2) {
                dispatch({type: SUCCESS, successMessage: "artifact.copied"})
            } else {
                dispatch({type: HANDLEDERROR, errorMessage: "error.couldNotProcess"})
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.COPY_TO_REPO, [repositoryId, artifactId]))
        }
    }
}


export const deleteArtifact = (artifactId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.deleteArtifact(artifactId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.DELETE_ARTIFACTS, [artifactId]));
        }
    };
};


export const shareWithRepo = (artifactId: string, repositoryIds: Array<string>) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            console.log(artifactId)
            console.log(repositoryIds)
            const response = await artifactController.shareWithRepository(artifactId, repositoryIds, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "share.successful" });
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.SHARE_WITH_REPO, [artifactId, repositoryIds]));
        }
    };
};


export const getAllSharedArtifacts = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.getAllSharedArtifacts(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SHARED_ARTIFACTS, sharedArtifacts: response.data})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_ALL_SHARED_ARTIFACTS, []));
        }
    };
};


export const getSharedArtifacts = (repositoryId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.getSharedArtifacts(repositoryId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SHARED_ARTIFACTS, sharedArtifacts: response.data})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_SHARED_ARTIFACTS, [repositoryId]));
        }
    };
};



export const getByRepositoryIdAndType = (repositoryId: string, type: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const artifactController = new ArtifactApi();
        try {
            const config = helpers.getClientConfig();
            const response = await artifactController.getByRepoIdAndType(repositoryId, type, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "Fetched ReponType" });
                dispatch({type: ARTIFACTS_BY_REPO_AND_TYPE, artifactsByRepoAndType: response.data})
            } else {
                dispatch({ type: HANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.GET_ALL_SHARED_ARTIFACTS, []));
        }
    };
};
