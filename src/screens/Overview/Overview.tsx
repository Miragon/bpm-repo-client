import {observer} from "mobx-react";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import PathStructure from "../../components/Layout/PathStructure";
import FavoriteArtifacts from "./FavoriteArtifacts";
import RecentArtifacts from "./RecentArtifacts";
import RepoAndTeamContainer from "./RepoAndTeamContainer";
import HeaderContainer from "../../components/Shared/HeaderContainer";

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
                <RepoAndTeamContainer />
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
