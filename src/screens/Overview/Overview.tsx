import {observer} from "mobx-react";
import React, {useEffect} from "react";
import "react-toastify/dist/ReactToastify.css";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import PathStructure, {CrumbElement} from "../../components/Layout/PathStructure";
import FavoriteArtifacts from "./FavoriteArtifacts";
import RecentArtifacts from "./RecentArtifacts";
import RepoAndTeamContainer from "./RepoAndTeamContainer";
import HeaderContainer from "../../components/Shared/HeaderContainer";
import {useHistory} from "react-router-dom";
import {getAllSharedArtifactsByType} from "../../store/actions/shareAction";



const Overview: React.FC = observer(() => {
    const history = useHistory();

    const path: Array<CrumbElement> = [{
        name: "path.overview",
        onClick: () => {
            history.push("/repository")
        }
    }];

    useEffect(() => {
        getAllSharedArtifactsByType("CONFIGURATION").then(response => {
            console.log(response.data)
        })

    })

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
