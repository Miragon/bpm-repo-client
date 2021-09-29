import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {
    createUserAssignment,
    deleteAssignment, deleteRepository,
    fetchArtifactsFromRepo,
    fetchAssignedUsers,
    getSingleRepository, updateRepository, updateUserAssignment
} from "../../store/actions";
import {ArtifactTO, RepositoryTO} from "../../api";
import {RootState} from "../../store/reducers/rootReducer";
import PathStructure from "../../components/Layout/PathStructure";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import {ACTIVE_REPO, SYNC_STATUS_ACTIVE_ENTITY, SYNC_STATUS_ARTIFACT} from "../../constants/Constants";
import helpers from "../../util/helperFunctions";
import {useTranslation} from "react-i18next";
import Details from "../../components/Shared/Details";
import ArtifactDetails from "../../components/Artifact/ArtifactDetails";
import SharedArtifacts from "../../components/Artifact/SharedArtifacts";
import {getAllArtifactsSharedWithTeam} from "../../store/actions/shareAction";

const Repository: React.FC = (() => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const { repoId } = useParams<{ repoId: string }>();
    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);
    const activeEntitySynced: boolean = useSelector((state: RootState) => state.dataSynced.activeEntitySynced);
    const artifactSynced: boolean = useSelector((state: RootState) => state.dataSynced.artifactSynced);


    const [artifacts, setArtifacts] = useState<Array<ArtifactTO>>([]);



    const getRepo = useCallback(() => {
        getSingleRepository(repoId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({ type: ACTIVE_REPO, activeRepo: response.data });
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
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchArtifacts())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchArtifacts())
        })
    }, [t, repoId])

    useEffect(() => {
        if(!activeEntitySynced){
            getRepo();
            dispatch({type: SYNC_STATUS_ACTIVE_ENTITY, dataSynced: true})
        }
    }, [activeEntitySynced, dispatch, getRepo])

    useEffect(() => {
        if(!artifactSynced){
            fetchArtifacts();
            dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true });
        }
    }, [activeEntitySynced, artifactSynced, dispatch, fetchArtifacts])

    useEffect(() => {
        getRepo()
        dispatch({type: SYNC_STATUS_ACTIVE_ENTITY, dataSynced: true})
        fetchArtifacts();
        dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true });
    }, [getRepo, fetchArtifacts, dispatch])

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
            {(activeRepo && activeRepo.id === repoId) &&
                <div>
                    <ErrorBoundary>
                        <PathStructure structure={path} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Details
                            targetId={repoId}
                            entity={"repository"}
                            object={activeRepo}
                            createAssignmentMethod={createUserAssignment}
                            deleteAssignmentMethod={deleteAssignment}
                            fetchAssignedUsersMethod={fetchAssignedUsers}
                            updateAssignmentMethod={updateUserAssignment}
                            deleteEntityMethod={deleteRepository}
                            updateEntityMethod={updateRepository}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <ArtifactDetails
                            id={repoId}
                            view={"repository"}
                            artifacts={artifacts}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <SharedArtifacts/>
                    </ErrorBoundary>

                </div>
            }
        </>
    );
});

export default Repository;
