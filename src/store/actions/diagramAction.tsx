import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {
    DiagramUpdateTO,
    DiagramVersionUploadTO,
    DiagramVersionUploadTOSaveTypeEnum,
    NewDiagramTO
} from "../../api/models";
import helpers from "../../constants/Functions";
import {
    ACTIVE_DIAGRAMS,
    DEFAULT_BPMN_SVG,
    DEFAULT_DMN_FILE,
    DEFAULT_DMN_SVG,
    DEFAULT_XML_FILE,
    DIAGRAM_UPLOAD,
    DIAGRAMQUERY_EXECUTED,
    GET_FAVORITE,
    GET_RECENT,
    SEARCH_DIAGRAMS,
    SUCCESS,
    SYNC_STATUS_DIAGRAM,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY,
    SYNC_STATUS_VERSION,
    UNHANDLEDERROR
} from "../constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";

export const fetchFavoriteDiagrams = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const response = await diagramController.getStarred(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: GET_FAVORITE, favoriteDiagrams: response.data });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_FAVORITE_DIAGRAMS, []));
        }
    };
};

export const fetchRecentDiagrams = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const response = await diagramController.getRecent(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: GET_RECENT, recentDiagrams: response.data });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_RECENT_DIAGRAMS, []));
        }
    };
};

export const createDiagram = (
    repoId: string,
    name: string,
    description: string,
    fileType?: string
) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const newDiagramTO: NewDiagramTO = {
                name: name,
                description: description,
                fileType: fileType || "BPMN",
                svgPreview: fileType === "dmn" ? DEFAULT_DMN_SVG : DEFAULT_BPMN_SVG
            };
            const response = await diagramController.createDiagram(newDiagramTO, repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SYNC_STATUS_DIAGRAM, dataSynced: false });
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_DIAGRAM, [
                repoId, name, description, fileType
            ]));
        }
    };
};


export const createDiagramWithDefaultVersion = (repoId: string, name: string, description: string, fileType?: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const newDiagramTO: NewDiagramTO = {
                name: name,
                description: description,
                fileType: fileType || "BPMN",
                svgPreview: fileType === "dmn" ? DEFAULT_DMN_SVG : DEFAULT_BPMN_SVG
            };

            await diagramController.createDiagram(newDiagramTO, repoId, config)
                .then(response => {
                    if (Math.floor(response.status / 100) === 2) {
                        const diagramVersionUploadTO: DiagramVersionUploadTO = {
                            saveType: DiagramVersionUploadTOSaveTypeEnum.MILESTONE,
                            xml: fileType === "bpmn" ? DEFAULT_XML_FILE : DEFAULT_DMN_FILE
                        }
                        const versionController = new api.VersionApi();
                        try {
                            const config = helpers.getClientConfig();
                            versionController.createOrUpdateVersion(diagramVersionUploadTO, response.data.id, config)
                                .then(response2 => {
                                    if (Math.floor(response2.status / 100) === 2) {
                                        dispatch({type: SUCCESS, successMessage: "diagram.createdDefault"});
                                        dispatch({type: SYNC_STATUS_VERSION, dataSynced: false});
                                    } else {
                                        dispatch({type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess"});
                                    }
                                }
                                );
                        } catch (error) {
                            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_VERSION, [response.data.id, diagramVersionUploadTO.xml, DiagramVersionUploadTOSaveTypeEnum.MILESTONE]));
                        }
                        dispatch({type: SYNC_STATUS_DIAGRAM, dataSynced: false });
                        dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                    } else {
                        dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
                    }
                });



        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_DIAGRAM, [
                repoId, name, description, fileType
            ]));
        }
    };
};




export const createNewDiagramWithVersionFile = (repoId: string, name: string, description: string, file: string, fileType: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const newDiagramTO: NewDiagramTO = {
                name: name,
                description: description,
                fileType: fileType || "BPMN",
                svgPreview: fileType === "dmn" ? DEFAULT_DMN_SVG : DEFAULT_BPMN_SVG
            };
            await diagramController.createDiagram(newDiagramTO, repoId, config)
                .then(response => {
                    if (Math.floor(response.status / 100) === 2) {
                        const diagramVersionUploadTO: DiagramVersionUploadTO = {
                            saveType: DiagramVersionUploadTOSaveTypeEnum.MILESTONE,
                            xml: file
                        }
                        const versionController = new api.VersionApi();
                        try {
                            const config = helpers.getClientConfig();
                            versionController.createOrUpdateVersion(diagramVersionUploadTO, response.data.id, config)
                                .then(response2 => {
                                    if (Math.floor(response2.status / 100) === 2) {
                                        dispatch({type: SUCCESS, successMessage: "diagram.createdFromExisting"});
                                        dispatch({type: SYNC_STATUS_VERSION, dataSynced: false});
                                    } else {
                                        dispatch({type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess"});
                                    }
                                }
                                );
                        } catch (error) {
                            dispatch(handleError(error, ActionType.CREATE_OR_UPDATE_VERSION, [response.data.id, file, DiagramVersionUploadTOSaveTypeEnum.MILESTONE]));
                        }
                        dispatch({type: SYNC_STATUS_DIAGRAM, dataSynced: false });
                        dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                    } else {
                        dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
                    }
                });


        } catch (error) {
            dispatch(handleError(error, ActionType.CREATE_DIAGRAM, [
                repoId, name, description, fileType
            ]));
        }
    };
};


export const updateDiagram = (name: string, description: string | undefined, diagramId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            // eslint-disable-next-line object-shorthand
            const diagramUpdateTO: DiagramUpdateTO = {
                name: name,
                description: description
            }
            const response = await diagramController.updateDiagram(diagramUpdateTO, diagramId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SYNC_STATUS_DIAGRAM, dataSynced: false})
                dispatch({ type: SUCCESS, successMessage: "diagram.updated" });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_DIAGRAMS_FROM_REPO, [name, description]));
        }
    };
};

export const fetchDiagramsFromRepo = (repoId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const response = await diagramController.getDiagramsFromRepo(repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ACTIVE_DIAGRAMS, diagrams: response.data });
                dispatch({ type: SYNC_STATUS_DIAGRAM, dataSynced: true });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.FETCH_DIAGRAMS_FROM_REPO, [repoId]));
        }
    };
};

export const uploadDiagram = (repoId: string, name: string, description: string, fileType?: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const newDiagram: NewDiagramTO = {
                name: name,
                description: description,
                fileType: fileType ? fileType : "bpmn"
            };
            const config = helpers.getClientConfig();
            const response = await diagramController.createDiagram(newDiagram, repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: DIAGRAM_UPLOAD, uploadedDiagram: response.data });
                dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false})
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.UPLOAD_DIAGRAM, [repoId, name, description]));
        }
    };
};

export const searchDiagram = (typedTitle: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const response = await diagramController.searchDiagrams(typedTitle, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SEARCH_DIAGRAMS, searchedDiagrams: response.data });
                dispatch({type: DIAGRAMQUERY_EXECUTED, diagramResultsCount: response.data.length})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.SEARCH_DIAGRAM, [typedTitle]));
        }
    };
};

export const deleteDiagram = (diagramId: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const response = await diagramController.deleteDiagram(diagramId, config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SYNC_STATUS_DIAGRAM, dataSynced: false });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "error.couldNotProcess" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.DELETE_DIAGRAM, [diagramId]));
        }
    };
};
