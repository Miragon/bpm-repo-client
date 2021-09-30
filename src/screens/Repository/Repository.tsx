import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {
    createUserAssignment,
    deleteAssignment,
    deleteRepository,
    fetchArtifactsFromRepo,
    fetchAssignedUsers,
    getSingleRepository,
    updateRepository,
    updateUserAssignment
} from "../../store/actions";
import {ArtifactTO, RepositoryTO, TeamTO} from "../../api";
import {RootState} from "../../store/reducers/rootReducer";
import PathStructure from "../../components/Layout/PathStructure";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import {SYNC_STATUS_ACTIVE_ENTITY, SYNC_STATUS_ARTIFACT} from "../../constants/Constants";
import helpers from "../../util/helperFunctions";
import {useTranslation} from "react-i18next";
import Details from "../../components/Shared/Details";
import ArtifactDetails from "../../components/Artifact/ArtifactDetails";
import SharedArtifacts from "../../components/Artifact/SharedArtifacts";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {Tab} from "@material-ui/core";
import Settings from "../../components/Shared/Settings";
import RepositoryMembers from "./RepositoryMembers";

const Repository: React.FC = (() => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const { repoId } = useParams<{ repoId: string }>();
    const activeEntitySynced: boolean = useSelector((state: RootState) => state.dataSynced.activeEntitySynced);
    const artifactSynced: boolean = useSelector((state: RootState) => state.dataSynced.artifactSynced);

    const [repository, setRepository] = useState<RepositoryTO>();
    const [artifacts, setArtifacts] = useState<Array<ArtifactTO>>([]);
    const [openedTab, setOpenedTab] = useState<string>("artifacts");



    const getRepo = useCallback(() => {
        getSingleRepository(repoId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                setRepository(response.data)
                dispatch({ type: SYNC_STATUS_ACTIVE_ENTITY, dataSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getRepo())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getRepo())
        })
    }, [dispatch, repoId, t]);


    const fetchArtifacts = useCallback(async () => {
        fetchArtifactsFromRepo(repoId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setArtifacts(response.data)
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchArtifacts())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchArtifacts())
        })
    }, [repoId, dispatch, t])

    useEffect(() => {
        if(!activeEntitySynced){
            getRepo();
        }
    }, [activeEntitySynced, getRepo])

    useEffect(() => {
        if(!artifactSynced){
            fetchArtifacts();
        }
    }, [activeEntitySynced, artifactSynced, fetchArtifacts])

    useEffect(() => {
        getRepo()
        fetchArtifacts();
    }, [getRepo, fetchArtifacts])


    const handleChangeTab = (event: any, newValue: string) => {
        setOpenedTab(newValue)
    }


    const element = {
        name: "path.overview",
        link: "/"
    }
    const element2 = {
        name: "path.repository",
        link: `#/repository/${repoId}`
    }
    const path = [element, element2]


    return (
        <>
            {(repository && repository.id === repoId) &&
                <div>
                    <ErrorBoundary>
                        <PathStructure structure={path} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Details object={repository}/>
                    </ErrorBoundary>
                    <ErrorBoundary>

                        <TabContext value={openedTab} >

                            <TabList onChange={handleChangeTab}>
                                <Tab label={t("artifact.artifacts")} value="artifacts" fullWidth={true}/>
                                <Tab label={t("repository.members")} value="members" fullWidth={true} />
                                <Tab label={t("deployment.deployments")} value="deployments" fullWidth={true} />
                                <Tab label={t("repository.settings")} value="settings" fullWidth={true} />
                            </TabList>

                            <TabPanel value={"artifacts"}>
                                <ArtifactDetails
                                    artifacts={artifacts}
                                    id={repoId}
                                    view={"repository"}/>

                                <SharedArtifacts/>

                            </TabPanel>

                            <TabPanel value={"members"}>
                                <RepositoryMembers
                                    targetId={repoId} />
                            </TabPanel>

                            <TabPanel value={"deployments"}>
                                TBD
                            </TabPanel>

                            <TabPanel value={"settings"}>
                                <Settings
                                    targetId={repository.id}
                                    entityName={repository.name}
                                    entityDescription={repository.description}
                                    updateEntityMethod={updateRepository}
                                    deleteEntityMethod={deleteRepository} />

                            </TabPanel>

                        </TabContext>

                    </ErrorBoundary>


                </div>
            }
        </>
    );
});

export default Repository;
