import {observer} from "mobx-react";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import PathStructure from "../../components/Layout/PathStructure";
import HeaderContainer from "../Dialogs/HeaderContainer";
import FavoriteArtifacts from "./FavoriteArtifacts";
import RecentArtifacts from "./RecentArtifacts";
import RepoContainer from "./RepoContainer";

const path = [{
    name: "path.overview",
    link: "/"
}];

const Overview: React.FC = observer(() => {
    return (
        <>
            <PathStructure structure={path} />
            <ErrorBoundary>
                <HeaderContainer />
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
