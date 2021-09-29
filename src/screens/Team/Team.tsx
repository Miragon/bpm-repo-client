import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";
import {ArtifactTO, RepositoryTO, TeamTO} from "../../api";
import {RootState} from "../../store/reducers/rootReducer";
import React, {useCallback, useEffect, useState} from "react";
import {
    ACTIVE_ARTIFACTS,
    ACTIVE_TEAM,
    SYNC_STATUS_ACTIVE_ENTITY,
    SYNC_STATUS_ARTIFACT
} from "../../constants/Constants";
import helpers from "../../util/helperFunctions";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import PathStructure from "../../components/Layout/PathStructure";
import {deleteTeam, getTeam, updateTeam} from "../../store/actions/teamAction";
import {getAllArtifactsSharedWithTeam} from "../../store/actions/shareAction";
import Details from "../../components/Shared/Details";
import {
    createUserTeamAssignment,
    deleteUserTeamAssignment,
    fetchTeamAssignedUsers, updateUserTeamAssignment
} from "../../store/actions/teamAssignmentAction";
import ArtifactDetails from "../../components/Artifact/ArtifactDetails";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {setRef, Tab} from "@material-ui/core";
import {getAllRepositoriesForTeam} from "../../store/actions";
import Card from "../Overview/Holder/Card";
import {getRepositoryUrl} from "../../util/Redirections";
import {makeStyles} from "@material-ui/styles";
import {useHistory} from "react-router-dom";
import Section from "../../components/Layout/Section";

const useStyles = makeStyles(() => ({
    horizontalAlignment: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "start",
        flexWrap: "wrap",
        rowGap: "20px",
        columnGap: "20px"
    },
    tab: {
        flexGrow: 1,
        maxWidth: "100%"
    },

    tabList: {
        width: "100%"
    }
}));



const Team: React.FC = (() => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const { teamId } = useParams<{ teamId: string }>();


    const activeEntitySynced: boolean = useSelector((state: RootState) => state.dataSynced.activeEntitySynced);
    const artifactSynced: boolean = useSelector((state: RootState) => state.dataSynced.artifactSynced);

    const [team, setTeam] = useState<TeamTO>();
    const [repos, setRepos] = useState<Array<RepositoryTO>>([]);
    const [artifacts, setArtifacts] = useState<Array<ArtifactTO>>([]);
    const [openedTab, setOpenedTab] = useState<string>("repositories");


    const fetchTeam = useCallback(() => {
        getTeam(teamId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                console.log("Team data:")
                console.log(response.data)
                setTeam(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchTeam())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchTeam())
        })
    }, [t, teamId]);

    const fetchArtifacts = useCallback(async () => {
        getAllArtifactsSharedWithTeam(teamId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setArtifacts(response.data)
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchArtifacts())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchArtifacts())
        })
    }, [dispatch, t, teamId])

    const fetchRepositories = useCallback(() => {
        getAllRepositoriesForTeam(teamId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setRepos(response.data)
                console.log(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchArtifacts())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchArtifacts())
        })
    }, [fetchArtifacts, t, teamId])


    useEffect(() => {
        if(!activeEntitySynced){
            //fetchTeam();
        }
    }, [fetchTeam, teamId, activeEntitySynced])

    useEffect(() => {
        if(!artifactSynced){
            fetchArtifacts();
        }
    }, [teamId, activeEntitySynced, artifactSynced, fetchArtifacts])

    useEffect(() => {
        console.log("in Teams")
        fetchTeam();
        fetchRepositories();
        fetchArtifacts();
    }, [fetchArtifacts, fetchRepositories, fetchTeam, teamId])


    const handleChangeTab = (event: any, newValue: string) => {
        setOpenedTab(newValue)
    }

    const element = {
        name: "path.overview",
        link: "/"
    }
    const element2 = {
        name: "path.team",
        link: `#/team/${teamId}`
    }
    const path = [element, element2]


    //TODO hier tabs mit "Repositories", "Artifacts", "Members", "Settings"
    return (
        <>
            {(team && (team.id === teamId)) &&
                <div>
                    <ErrorBoundary>
                        <PathStructure structure={path} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Details
                            targetId={teamId}
                            entity={"team"}
                            object={team}
                            createAssignmentMethod={createUserTeamAssignment}
                            deleteAssignmentMethod={deleteUserTeamAssignment}
                            fetchAssignedUsersMethod={fetchTeamAssignedUsers}
                            updateAssignmentMethod={updateUserTeamAssignment}
                            deleteEntityMethod={deleteTeam}
                            updateEntityMethod={updateTeam}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <TabContext value={openedTab} >

                            <TabList onChange={handleChangeTab}>
                                <Tab label={t("repository.repositories")} value="repositories"   fullWidth={true}/>
                                <Tab label={t("artifact.artifacts")} value="artifacts" fullWidth={true}/>
                                <Tab label={t("team.members")} value="members" fullWidth={true} />
                                <Tab label={t("team.settings")} value="settings" fullWidth={true} />
                            </TabList>

                            <TabPanel value={"repositories"}>
                                <div className={classes.horizontalAlignment}>
                                    {repos.map(repo => (
                                        <Card
                                            key={repo.id}
                                            title={repo.name}
                                            onClick={() => history.push(getRepositoryUrl(repo))}
                                            assignedUsers={repo.assignedUsers}
                                            existingArtifacts={repo.existingArtifacts}/>
                                    ))}
                                    {repos?.length === 0 && (
                                        <span>{t("repository.notAvailable")}</span>
                                    )}
                                </div>
                            </TabPanel>


                            <TabPanel value={"artifacts"}>
                                <ArtifactDetails
                                    artifacts={artifacts}
                                    id={teamId}
                                    view={"team"}/>
                            </TabPanel>


                            <TabPanel value={"members"}>

                            </TabPanel>

                            <TabPanel value={"settings"}>

                            </TabPanel>


                        </TabContext>
                    </ErrorBoundary>


                </div>
            }
        </>
    );
});

export default Team;