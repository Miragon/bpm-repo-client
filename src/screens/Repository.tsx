import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import CreateContainer from "./Elements/CreateContainer";
import {BpmnDiagramTO, BpmnRepositoryRequestTO} from "../api/models";
import {RootState} from "../store/reducers/rootReducer";
import RepositoryDetails from "./Elements/RepositoryDetails";
import DiagramDetails from "./Elements/DiagramDetails";


const Repository: React.FC = (() => {

    return (
    <>
        <CreateContainer/>
        <RepositoryDetails/>
        <DiagramDetails/>
    </>
);
});

export default Repository;