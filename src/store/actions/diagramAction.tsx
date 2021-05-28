import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import helpers from "../../constants/Functions";
import {BpmnDiagramUploadTO} from "../../api/models";

export const GET_FAVORITE = "GET_FAVORITE"
export const GET_RECENT = "GET_RECENT"
export const DIAGRAM_UPLOAD = "DIAGRAM_UPLOAD"
export const HANDLEDERROR = "HANDLEDERROR"
export const UNHANDLEDERROR = "UNHANDLEDERROR"
export const SYNC_STATUS = "SYNC_STATUS"
export const SUCCESS = "SUCCESS"

const emptySvgPreview = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
    "<!-- created with bpmn-js / http://bpmn.io -->\n" +
    "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n" +
    "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"0\" height=\"0\" viewBox=\"0 0 0 0\" version=\"1.1\"></svg>"

export const fetchFavoriteDiagrams = () => {
    return async (dispatch: Dispatch) => {
        const diagramController = new api.BpmnDiagramControllerApi()

        try{
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await diagramController.getStarred(config)
            console.log("DiagramRequest")
            if(response.status === 200) {
                dispatch({type: GET_FAVORITE, favoriteDiagrams: response.data})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response.data){
                if(error.response.data.status === 409) {
                    dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
                }
                else{
                    dispatch({type: UNHANDLEDERROR, errorMessage: error.response.status})

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
            if(response.status === 200) {
                dispatch({type: GET_RECENT, recentDiagrams: response.data})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response.data.status === 409) {
                dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
            }
            else{
                dispatch({type: UNHANDLEDERROR, errorMessage: error.response.status})

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
                svgPreview: emptySvgPreview
            }
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await diagramController.createOrUpdateDiagram(bpmnDiagramUploadTO, bpmnRepositoryId, config)
            if(response.status === 200) {
                console.log("New Diagram created, create Toast for that when modeler is running on the same page")
                window.location.href = (`/modeler/${response.data.bpmnRepositoryId}/${response.data.bpmnDiagramId}/latest/`)
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            //#TODO kann der Fehler im Backend nur durch die error.response.data properties ausgelesen werden?
            if(error.response.data.status === 409) {
                dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
            }
            else{
                dispatch({type: UNHANDLEDERROR, errorMessage: error.response.status})

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
            if(response.status === 200) {
                dispatch({type: DIAGRAM_UPLOAD, uploadedDiagram: response.data})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response.data.status === 409) {
                dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
            }
            else{
                dispatch({type: UNHANDLEDERROR, errorMessage: error.response.status})

            }
        }
    }
}
