import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import {BpmnDiagramVersionUploadTO, BpmnDiagramVersionUploadTOSaveTypeEnum} from "../../api/models";
import helpers from "../../constants/Functions";
import {HANDLEDERROR, UNHANDLEDERROR} from "./diagramAction";
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
            if(response.status === 200) {
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