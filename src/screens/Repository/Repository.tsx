import {observer} from "mobx-react";
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import CreateContainer from "../CreateContainer/CreateContainer";
import {BpmnDiagramTO, BpmnRepositoryRequestTO} from "../../api/models";
import {RootState} from "../../store/reducers/rootReducer";
import RepositoryDetails from "./RepositoryDetails";
import DiagramDetails from "./DiagramDetails";
import {useParams} from "react-router";
import {getSingleRepository} from "../../store/actions/repositoryAction";


const Repository: React.FC = (() => {
    const dispatch = useDispatch();
    const { repoId } = useParams<{repoId: string}>();

    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        console.log(repoId)
        getRepo()
    })


    const getRepo = useCallback(() => {
        dispatch(getSingleRepository(repoId))
    }, [dispatch])


    return (
    <>
        <RepositoryDetails/>
        <DiagramDetails/>
    </>
);
});

export default Repository;