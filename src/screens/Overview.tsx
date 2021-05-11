import { observer } from "mobx-react";
import React, { useEffect } from 'react';
import '../App.css';
import { useStore } from "../providers/RootStoreProvider";
import CreateContainer from "./Elements/CreateContainer";
import RecentDiagrams from "./Elements/RecentDiagrams";
import RepoContainer from "./Elements/RepoContainer";
import StarredDiagrams from "./Elements/StarredDiagrams";

const Overview: React.FC = observer(() => {
    const store = useStore();

    useEffect(() => {
        store.repoStore.initialize();
    }, [store.repoStore])

    return (
        <>
            <CreateContainer />
            <RepoContainer />
            <RecentDiagrams />
            <StarredDiagrams />
        </>
    );
});

export default Overview;
