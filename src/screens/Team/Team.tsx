import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";
import {TeamTO} from "../../api";
import {RootState} from "../../store/reducers/rootReducer";
import React, {useCallback, useEffect} from "react";
import {ACTIVE_TEAM, SYNC_STATUS_ACTIVE_TEAM} from "../../constants/Constants";
import helpers from "../../util/helperFunctions";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import PathStructure from "../../components/Layout/PathStructure";
import ArtifactDetails from "../Repository/Artifact/ArtifactDetails";
import {getTeam} from "../../store/actions/teamAction";
import {getAllArtifactsSharedWithTeam} from "../../store/actions/shareAction";


const Team: React.FC = (() => {

    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const { teamId } = useParams<{ teamId: string }>();
    const activeTeam: TeamTO = useSelector((state: RootState) => state.team.activeTeam);
    const teamSynced: boolean = useSelector((state: RootState) => state.dataSynced.activeTeamSynced);

    const fetchTeam = useCallback((repositoryId: string) => {
        getTeam(repositoryId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                console.log(response.data)
                dispatch({ type: ACTIVE_TEAM, activeTeam: response.data });
                dispatch({type: SYNC_STATUS_ACTIVE_TEAM, dataSynced: true})
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchTeam(teamId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchTeam(teamId))
        })
    }, [dispatch, teamId, t]);


    useEffect(() => {
        if(!teamSynced){
            fetchTeam(teamId);
        }
    }, [fetchTeam, teamId, teamSynced])

    useEffect(() => {
        fetchTeam(teamId)
    }, [teamId, fetchTeam])

    const element = {
        name: "path.overview",
        link: "/"
    }
    const element2 = {
        name: "path.team",
        link: `#/team/${teamId}`
    }
    const path = [element, element2]


    return (
        <>
            {(activeTeam && (activeTeam.id === teamId)) &&
                <div>
                    <ErrorBoundary>
                        <PathStructure structure={path} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <ArtifactDetails fetchArtifactsMethod={getAllArtifactsSharedWithTeam} id={teamId} view={"repository"}/>
                    </ErrorBoundary>

                </div>
            }
        </>
    );
});

export default Team;