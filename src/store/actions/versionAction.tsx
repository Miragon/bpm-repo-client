import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {BpmnDiagramVersionUploadTO, BpmnDiagramVersionUploadTOSaveTypeEnum} from "../../api/models";
import helpers from "../../constants/Functions";
import {HANDLEDERROR, UNHANDLEDERROR} from "./diagramAction";

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
            if(response.status === 200) {
                window.location.href = (`/modeler/${bpmnRepositoryId}/${bpmnDiagramId}/latest/`)
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