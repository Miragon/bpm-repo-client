import {Dispatch} from "@reduxjs/toolkit";
import helpers from "../../constants/Functions";
import * as api from "../../api/api"
import {HANDLEDERROR, SUCCESS, SYNC_STATUS, UNHANDLEDERROR} from "./diagramAction";
import {NewBpmnRepositoryTO} from "../../api/models";


export const GET_REPOS = "GET_REPOS"

export const fetchRepositories = () => {
    return async (dispatch: Dispatch) => {
        const repositoryController = new api.BpmnRepositoryControllerApi() //config was passed before
        try {
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))

            const response = await repositoryController.getAllRepositories(config)
            if(response.status === 200){
                dispatch({type: GET_REPOS, repos: response.data})
                dispatch({type: SYNC_STATUS, dataSynced: true})

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

export const createRepository = (bpmnRepositoryName: string, bpmnRepositoryDescription: string) => {
    return async (dispatch: Dispatch) => {
        const repositoryController = new api.BpmnRepositoryControllerApi() //config was passed before
        try {
            const newBpmnRepositoryTO: NewBpmnRepositoryTO = {
                bpmnRepositoryName: bpmnRepositoryName,
                bpmnRepositoryDescription: bpmnRepositoryDescription
            }
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await repositoryController.createRepository(newBpmnRepositoryTO, config)
            if(response.status === 200){
                dispatch({type: SUCCESS, successMessage: "Repository created"})
                dispatch({type: SYNC_STATUS, dataSynced: false})
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

