import {observer} from "mobx-react";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import CreateContainer from "../Dialogs/CreateContainer";
import FavoriteArtifacts from "./FavoriteArtifacts";
import RecentArtifacts from "./RecentArtifacts";
import RepoContainer from "./RepoContainer";
import PathStructure from "../../components/Layout/PathStructure";

const Overview: React.FC = observer(() => {

    const element = {
        name: "path.overview",
        link: "/"
    }
    const path = [element]

    return (
        <>
            <PathStructure structure={path} />
            <ErrorBoundary>
                <CreateContainer />
            </ErrorBoundary>
            <ErrorBoundary>
                <RepoContainer />
            </ErrorBoundary>
            <ErrorBoundary>
                <RecentArtifacts />
            </ErrorBoundary>
            <ErrorBoundary>
                <FavoriteArtifacts />
            </ErrorBoundary>
        </>
    );
});

export default Overview;
