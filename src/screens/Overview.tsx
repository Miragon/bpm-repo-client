import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import '../App.css';
import CreateContainer from "./Elements/CreateContainer";
import RecentDiagrams from "./Elements/RecentDiagrams";
import RepoContainer from "./Elements/RepoContainer";
import FavoriteDiagrams from "./Elements/FavoriteDiagrams";
import {toast, ToastContainer} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/reducers/rootReducer";
import 'react-toastify/dist/ReactToastify.css';
import {HANDLEDERROR, SUCCESS} from "../store/actions/diagramAction";


const Overview: React.FC = observer(() => {
    const dispatch = useDispatch()
    const apiErrorState: string = useSelector((state: RootState) => state.api.errorMessage)
    const apiSuccessState: string = useSelector((state: RootState) => state.api.successMessage)

    useEffect(() => {
            if(apiErrorState){
                toast.error(apiErrorState, {autoClose: 8000, pauseOnHover: true})
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
            <ToastContainer/>
        </>
    );
});

export default Overview;
