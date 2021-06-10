import {Dispatch} from "@reduxjs/toolkit";
import * as api from "../../api/api";
import helpers from "../../constants/Functions";
import {defaultErrors} from "../../components/Exception/defaultErrors";
import {ASSIGNED_USERS, HANDLEDERROR, SUCCESS, SYNC_STATUS, UNHANDLEDERROR} from "./diagramAction";
import {AssignmentWithUserNameTO, AssignmentWithUserNameTORoleEnumEnum} from "../../api/models";

export const getAllAssignedUsers = (repoId: string) => {
    return async (dispatch: Dispatch) => {
        const assignmentController = new api.AssignmentControllerApi()

        try{
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await assignmentController.getAllAssignedUsers(repoId, config)
            if(Math.floor(response.status/100) === 2) {
                dispatch({type: ASSIGNED_USERS, assignedUsers: response.data})
                dispatch({type: SYNC_STATUS, dataSynced: true})

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

export const createOrUpdateUserAssignment = (repoId: string, userName: string, roleEnum?: AssignmentWithUserNameTORoleEnumEnum) => {
    return async (dispatch: Dispatch) => {
        const assignmentController = new api.AssignmentControllerApi()
        let message = ""
        try{
            if(!roleEnum){
                message = "Added User to Repository"
            } else {
                message = `Changed role of ${userName} to ${roleEnum}`
            }

            const assignment: AssignmentWithUserNameTO = {
                bpmnRepositoryId: repoId,
                userName: userName,
                roleEnum: (roleEnum) ? roleEnum : AssignmentWithUserNameTORoleEnumEnum.MEMBER
            }
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await assignmentController.createOrUpdateUserAssignment(assignment, config)
            if(Math.floor(response.status/100) === 2) {
                dispatch({type: SUCCESS, successMessage: message})
                dispatch({type: SYNC_STATUS, dataSynced: false})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response){
                switch(error.response.data.status.toString()) {
                    case "400":
                        dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
                        return;
                    case "401":
                        dispatch({type: HANDLEDERROR, errorMessage: error.response.data.message})
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

export const deleteAssignment = (repoId: string, userName: string) => {
    return async (dispatch: Dispatch) => {
        const assignmentController = new api.AssignmentControllerApi()
        try{
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            const response = await assignmentController.deleteUserAssignment(repoId, userName, config)
            if(Math.floor(response.status/100) === 2) {
                dispatch({type: SUCCESS, successMessage: `Removed ${userName} from Repository`})
                dispatch({type: SYNC_STATUS, dataSynced: false})
            }
            else {
                dispatch({type: UNHANDLEDERROR, errorMessage: response.status + "" + JSON.stringify(response)})
            }
        } catch (error){
            if(error.response){
                switch(error.response.data.status) {
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