import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {deleteRepository, fetchArtifactsFromRepo, getSingleRepository, updateRepository} from "../../store/actions";
import {ArtifactTO, RepositoryTO} from "../../api";
import {RootState} from "../../store/reducers/rootReducer";
import PathStructure, {CrumbElement} from "../../components/Layout/PathStructure";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import {
    ACTIVE_REPO,
    SHARED_ARTIFACTS,
    SYNC_STATUS_ACTIVE_ENTITY,
    SYNC_STATUS_ARTIFACT, SYNC_STATUS_FAVORITE, SYNC_STATUS_RECENT
} from "../../constants/Constants";
import helpers from "../../util/helperFunctions";
import {useTranslation} from "react-i18next";
import Details from "../../components/Shared/Details";
import ArtifactDetails from "../../components/Artifact/ArtifactDetails";
import SharedArtifacts from "../../components/Artifact/SharedArtifacts";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {Tab} from "@material-ui/core";
import Settings from "../../components/Shared/Settings";
import RepositoryMembers from "./RepositoryMembers";
import {getSharedArtifacts} from "../../store/actions/shareAction";
import {useHistory} from "react-router-dom";
import Deployments from "./Deployments";

const Repository: React.FC = (() => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");
    const history = useHistory();

    const { repoId } = useParams<{ repoId: string }>();
    const activeEntitySynced: boolean = useSelector((state: RootState) => state.dataSynced.activeEntitySynced);
    const artifactSynced: boolean = useSelector((state: RootState) => state.dataSynced.artifactSynced);

    const [repository, setRepository] = useState<RepositoryTO>();
    const [artifacts, setArtifacts] = useState<Array<ArtifactTO>>([]);
    const [sharedArtifacts, setSharedArtifacts] = useState<Array<ArtifactTO>>([]);
    const [openedTab, setOpenedTab] = useState<string>("artifacts");



    const getRepo = useCallback(() => {
        getSingleRepository(repoId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                setRepository(response.data)
                dispatch({ type: SYNC_STATUS_ACTIVE_ENTITY, dataSynced: true });
                dispatch({type: ACTIVE_REPO, activeRepo: response.data})
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getRepo())
            }
        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => getRepo())
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
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchArtifacts())
        })
    }, [repoId, dispatch, t])

    const fetchSharedArtifacts = useCallback(async (repoId: string) => {
        getSharedArtifacts(repoId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setSharedArtifacts(response.data)
                dispatch({ type: SHARED_ARTIFACTS, sharedArtifacts: response.data })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchSharedArtifacts(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchSharedArtifacts(repoId))
        })
    }, [dispatch, t])

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
        setRepository(undefined)
        setArtifacts([])
        setSharedArtifacts([])
        getRepo()
        fetchArtifacts();
        fetchSharedArtifacts(repoId);
    }, [getRepo, fetchArtifacts, fetchSharedArtifacts, repoId])


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeTab = (event: any, newValue: string) => {
        setOpenedTab(newValue)
    }

    const element: CrumbElement = {
        name: "path.overview",
        onClick: () => {
            setArtifacts([]);
            setSharedArtifacts([]);
            dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false})
            dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
            dispatch({type: SYNC_STATUS_FAVORITE, dataSynced: false})
            history.push("/")
        }
    }
    const element2: CrumbElement = {
        name: "path.repository",
        onClick: () => history.push(`/repository/${repoId}`)
    }
    const path: Array<CrumbElement> = [element, element2]


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

                                <SharedArtifacts sharedArtifacts={sharedArtifacts}/>

                            </TabPanel>

                            <TabPanel value={"members"}>
                                <RepositoryMembers
                                    targetId={repoId} />
                            </TabPanel>

                            <TabPanel value={"deployments"}>
                                <Deployments artifacts={artifacts} repositoryId={repoId} />
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
