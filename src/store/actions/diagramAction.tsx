import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import helpers from "../../constants/Functions";
import {BpmnDiagramUploadTO} from "../../api/models";
import {defaultErrors} from "../../components/Exception/defaultErrors";
import {ACTIVE_DIAGRAMS} from "./repositoryAction";

export const GET_FAVORITE = "GET_FAVORITE"
export const GET_RECENT = "GET_RECENT"
export const DIAGRAM_UPLOAD = "DIAGRAM_UPLOAD"
export const HANDLEDERROR = "HANDLEDERROR"
export const UNHANDLEDERROR = "UNHANDLEDERROR"
export const UNHANDLEDERRORRETRY = "UNHANDLEDERRORRETRY"
export const SYNC_STATUS = "SYNC_STATUS"
export const SUCCESS = "SUCCESS"
export const GET_VERSIONS = "GET_VERSIONS"
export const ASSIGNED_USERS = "ASSIGNED_USERS"
export const CURRENT_USER_INFO = "CURRENT_USER_INFO"

export const fetchFavoriteDiagrams = () => {
    return async (dispatch: Dispatch) => {
        const diagramController = new api.BpmnDiagramControllerApi()

        try{
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await diagramController.getStarred(config)
            console.log("DiagramRequest")
            if(Math.floor(response.status/100) === 2) {
                dispatch({type: GET_FAVORITE, favoriteDiagrams: response.data})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response){
                switch(error.response.data.status.toString()) {
                    case "400":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["400"]})
                        return;
                    case "401":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["401"]})
                        return;
                    case "403":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["403"]})
                        return;
                    case "404":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["404"]})
                        return;
                    case "409":
                        dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
                        return;
                    default:
                        dispatch({type: UNHANDLEDERROR, errorMessage: `Error ${error.response.status}`})
                        return;

                }
            }
            console.log(error)
        }
    }
}

export const fetchRecentDiagrams = () => {
    return async (dispatch: Dispatch) => {
        const diagramController = new api.BpmnDiagramControllerApi()

        try{
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await diagramController.getRecent(config)
            if(Math.floor(response.status/100) === 2) {
                dispatch({type: GET_RECENT, recentDiagrams: response.data})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response){
                switch(error.response.data.status.toString()) {
                    case "400":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["400"]})
                        return;
                    case "401":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["401"]})
                        return;
                    case "403":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["403"]})
                        return;
                    case "404":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["404"]})
                        return;
                    case "409":
                        dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
                        return;
                    default:
                        dispatch({type: UNHANDLEDERROR, errorMessage: `Error ${error.response.status}`})
                        return;

                }
            }
        }
    }
}

export const createDiagram = (bpmnRepositoryId: string, bpmnDiagramName: string, bpmnDiagramDescription: string, fileType?: string) => {
    return async (dispatch: Dispatch) => {
        const diagramController = new api.BpmnDiagramControllerApi()
        try{
            const bpmnDiagramUploadTO: BpmnDiagramUploadTO = {
                bpmnDiagramName: bpmnDiagramName,
                bpmnDiagramDescription: bpmnDiagramDescription,
                fileType: fileType,
            }
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await diagramController.createOrUpdateDiagram(bpmnDiagramUploadTO, bpmnRepositoryId, config)
            if(Math.floor(response.status/100) === 2) {
                dispatch({type: SUCCESS, successMessage: "Diagram Created"})
                dispatch({type: SYNC_STATUS, dataSynced: false})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response){
                switch(error.response.data.status.toString()) {
                    case "400":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["400"]})
                        return;
                    case "401":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["401"]})
                        return;
                    case "403":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["403"]})
                        return;
                    case "404":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["404"]})
                        return;
                    case "409":
                        dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
                        return;
                    default:
                        dispatch({type: UNHANDLEDERROR, errorMessage: `Error ${error.response.status}`})
                        return;

                }
            }
        }
    }
}

export const fetchDiagramsFromRepo = (repoId: string) => {
    return async (dispatch: Dispatch) => {
        const diagramController = new api.BpmnDiagramControllerApi()
        console.log("Requesting diagramrepos")
        try{
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await diagramController.getDiagramsFromRepo(repoId, config)
            if(Math.floor(response.status/100) === 2) {
                dispatch({type: ACTIVE_DIAGRAMS, activeDiagrams: response.data})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response){
                switch(error.response.data.status.toString()) {
                    case "400":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["400"]})
                        return;
                    case "401":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["401"]})
                        return;
                    case "403":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["403"]})
                        return;
                    case "404":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["404"]})
                        return;
                    case "409":
                        dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
                        return;
                    default:
                        dispatch({type: UNHANDLEDERROR, errorMessage: `Error ${error.response.status}`})
                        return;

                }
            }
        }
    }
}

export const uploadDiagram = (bpmnRepositoryId: string, bpmnDiagramName: string, bpmnDiagramDescription: string) => {
    return async (dispatch: Dispatch) => {
        const diagramController = new api.BpmnDiagramControllerApi()
        try{
            const bpmnDiagramUploadTO: BpmnDiagramUploadTO = {
                bpmnDiagramName: bpmnDiagramName,
                bpmnDiagramDescription: bpmnDiagramDescription,
                fileType: "bpmn"
            }
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await diagramController.createOrUpdateDiagram(bpmnDiagramUploadTO, bpmnRepositoryId, config)
            if(Math.floor(response.status/100) === 2) {
                dispatch({type: DIAGRAM_UPLOAD, uploadedDiagram: response.data})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response){
                switch(error.response.data.status.toString()) {
                    case "400":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["400"]})
                        return;
                    case "401":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["401"]})
                        return;
                    case "403":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["403"]})
                        return;
                    case "404":
                        dispatch({type: UNHANDLEDERROR, errorMessage: defaultErrors["404"]})
                        return;
                    case "409":
                        dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
                        return;
                    default:
                        dispatch({type: UNHANDLEDERROR, errorMessage: `Error ${error.response.status}`})
                        return;

                }
            }
        }
    }
}
