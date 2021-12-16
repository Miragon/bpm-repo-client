import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ErrorBoundary } from "../../components/Exception/ErrorBoundary";
import PathStructure, { CrumbElement } from "../../components/Layout/PathStructure";
import FavoriteArtifacts from "./FavoriteArtifacts";
import RecentArtifacts from "./RecentArtifacts";
import RepoAndTeamContainer from "./RepoAndTeamContainer";
import HeaderContainer from "../../components/Shared/HeaderContainer";
import { SYNC_STATUS_ARTIFACT, SYNC_STATUS_FAVORITE } from "../../constants/Constants";

const Overview: React.FC = (() => {
    const history = useHistory();
    const dispatch = useDispatch();

    const path: Array<CrumbElement> = [{
        name: "path.overview",
        onClick: () => {
            dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
            dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: false });
            history.push("/");
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
