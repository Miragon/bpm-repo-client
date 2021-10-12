import React from "react";
import "react-toastify/dist/ReactToastify.css";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import PathStructure, {CrumbElement} from "../../components/Layout/PathStructure";
import FavoriteArtifacts from "./FavoriteArtifacts";
import RecentArtifacts from "./RecentArtifacts";
import RepoAndTeamContainer from "./RepoAndTeamContainer";
import HeaderContainer from "../../components/Shared/HeaderContainer";
import {useHistory} from "react-router-dom";


const Overview: React.FC = (() => {
    const history = useHistory();

    const path: Array<CrumbElement> = [{
        name: "path.overview",
        onClick: () => {
            history.push("/repository")
        }
    }];


    return (
        <>
            <PathStructure structure={path} />
            <ErrorBoundary>
                <RepoAndTeamContainer />
            </ErrorBoundary>
            <ErrorBoundary>
                <HeaderContainer />
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
