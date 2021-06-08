import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import CreateContainer from "../CreateContainer/CreateContainer";
import RecentDiagrams from "./RecentDiagrams";
import RepoContainer from "./RepoContainer";
import FavoriteDiagrams from "./FavoriteDiagrams";
import {toast, ToastContainer} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import 'react-toastify/dist/ReactToastify.css';
import {HANDLEDERROR, SUCCESS} from "../../store/actions/diagramAction";
import {Button} from "@material-ui/core";
import RepoCard from "./Holder/RepoCard";


const Overview: React.FC = observer(() => {
    const dispatch = useDispatch()
    const apiErrorState: string = useSelector((state: RootState) => state.api.errorMessage)
    const apiSuccessState: string = useSelector((state: RootState) => state.api.successMessage)

    
    //#TODO: Add a retry Button to the toast
    useEffect(() => {
            if(apiErrorState){
                //toast can contain any component, the Retry Button (and the message: apiErrorState) has to be passed here
                toast.error(<RepoCard repoTitle={"abc"} description={"def"} existingDiagrams={3} assignedUsers={2}></RepoCard>, {autoClose: 8000, pauseOnHover: true, role: "alert"})
                //toast.error(apiErrorState, {autoClose: 8000, pauseOnHover: true})
                dispatch({type: HANDLEDERROR, errorMessage: ""})
            }
            if(apiSuccessState){
                toast.success(apiSuccessState, {autoClose: 4000, pauseOnHover: true})
                dispatch({type: SUCCESS, successMessage: ""})
            }
    }, [apiErrorState, apiSuccessState, dispatch])


    return (
        <>
            <CreateContainer />
            <RepoContainer />
            <RecentDiagrams />
            <FavoriteDiagrams />
            <ToastContainer>
            </ToastContainer>
        </>
    );
});

export default Overview;
