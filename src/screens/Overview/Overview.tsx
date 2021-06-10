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



    return (
        <>
            <CreateContainer />
            <RepoContainer />
            <RecentDiagrams />
            <FavoriteDiagrams />
        </>
    );
});

export default Overview;
