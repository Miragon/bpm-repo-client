import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {BpmnDiagramVersionUploadTO, BpmnDiagramVersionUploadTOSaveTypeEnum} from "../../api/models";
import helpers from "../../constants/Functions";
import {GET_VERSIONS, HANDLEDERROR, UNHANDLEDERROR} from "./diagramAction";
import {defaultErrors} from "../../components/Exception/defaultErrors";

export const createOrUpdateVersion = (bpmnRepositoryId: string, bpmnDiagramId: string, file: string) => {
    return async (dispatch: Dispatch) => {
        const versionController = new api.BpmnDiagramVersionControllerApi()
        try{
            const bpmnDiagramVersionTO: BpmnDiagramVersionUploadTO = {
                bpmnAsXML: file,
                saveType: BpmnDiagramVersionUploadTOSaveTypeEnum.RELEASE
            }
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await versionController.createOrUpdateVersion(bpmnDiagramVersionTO, bpmnRepositoryId, bpmnDiagramId, config)
            if(Math.floor(response.status/100) === 2) {
                window.location.href = (`/modeler/${bpmnRepositoryId}/${bpmnDiagramId}/latest/`)
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

export const getAllVersions = (bpmnRepositoryId: string, bpmnDiagramId: string) => {
    return async (dispatch: Dispatch) => {
        try {

            const versionController = new api.BpmnDiagramVersionControllerApi()
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await versionController.getAllVersions(bpmnRepositoryId, bpmnDiagramId, config)
            if(Math.floor(response.status/100) === 2) {
                dispatch({type: GET_VERSIONS, versions: response.data})
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