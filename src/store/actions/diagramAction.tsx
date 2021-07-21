import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {DiagramUpdateTO, DiagramVersionUploadTOSaveTypeEnum, NewDiagramTO} from "../../api/models";
import helpers from "../../constants/Functions";
import {
    ACTIVE_DIAGRAMS,
    CREATE_DEFAULT_VERSION, CREATE_VERSION_WITH_FILE,
    DEFAULT_BPMN_SVG, DEFAULT_DMN_FILE,
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
    UNHANDLEDERROR
} from "../constants";
import {ActionType} from "./actions";
import {handleError} from "./errorAction";
import * as versionAction from "./versionAction";
import {DiagramVersionTO, DiagramVersionTOSaveTypeEnum} from "../../models";

export const fetchFavoriteDiagrams = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        const diagramController = new api.DiagramApi();
        try {
            const config = helpers.getClientConfig();
            const response = await diagramController.getStarred(config);
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: GET_FAVORITE, favoriteDiagrams: response.data });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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
    // TODO update muss wieder funktionieren
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
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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

            const response = await diagramController.createDiagram(newDiagramTO, repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                const newDiagramVersionTO: DiagramVersionTO = {
                    diagramId: response.data.id,
                    repositoryId: repoId,
                    saveType: DiagramVersionTOSaveTypeEnum.MILESTONE,
                    updatedDate: undefined,
                    xml: (fileType === "dmn") ? DEFAULT_DMN_FILE : DEFAULT_XML_FILE
                }
                dispatch({type: CREATE_DEFAULT_VERSION, defaultVersionProps: newDiagramVersionTO})
                dispatch({ type: SYNC_STATUS_DIAGRAM, dataSynced: false });
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
            }
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

            const response = await diagramController.createDiagram(newDiagramTO, repoId, config);
            if (Math.floor(response.status / 100) === 2) {
                const newDiagramVersionTO: DiagramVersionTO = {
                    diagramId: response.data.id,
                    repositoryId: repoId,
                    saveType: DiagramVersionTOSaveTypeEnum.MILESTONE,
                    updatedDate: undefined,
                    xml: file
                }
                dispatch({type: CREATE_VERSION_WITH_FILE, versionProps: newDiagramVersionTO})
                dispatch({ type: SYNC_STATUS_DIAGRAM, dataSynced: false });
                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
            }
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
                dispatch({ type: SUCCESS, successMessage: "Diagram updated" });
            } else {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
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
                dispatch({ type: UNHANDLEDERROR, errorMessage: "Could not process request" });
            }
        } catch (error) {
            dispatch(handleError(error, ActionType.DELETE_DIAGRAM, [diagramId]));
        }
    };
};
