import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {getSingleRepository} from "../../store/actions";
import ArtifactDetails from "./Artifact/ArtifactDetails";
import {RepositoryTO} from "../../api";
import {RootState} from "../../store/reducers/rootReducer";
import PathStructure from "../../components/Layout/PathStructure";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import SharedArtifacts from "./Artifact/SharedArtifacts";
import RepositoryDetails from "./RepositoryDetails/RepositoryDetails";
import {ACTIVE_REPO, SYNC_STATUS_ACTIVE_REPOSITORY} from "../../constants/Constants";
import helpers from "../../util/helperFunctions";
import {useTranslation} from "react-i18next";

const Repository: React.FC = (() => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const { repoId } = useParams<{ repoId: string }>();
    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);
    const repoSynced: boolean = useSelector((state: RootState) => state.dataSynced.activeRepoSynced);

    const getRepo = useCallback((repositoryId: string) => {
        getSingleRepository(repositoryId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({ type: ACTIVE_REPO, activeRepo: response.data });
                dispatch({type: SYNC_STATUS_ACTIVE_REPOSITORY, dataSynced: true})
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getRepo(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getRepo(repoId))
        })
    }, [dispatch, repoId, t]);


    useEffect(() => {
        if(!repoSynced){
            getRepo(repoId);
        }
    }, [repoSynced, getRepo, repoId])


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
                <div className={"content"}>
                    <ErrorBoundary>
                        <PathStructure structure={path} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <RepositoryDetails/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <ArtifactDetails/>
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
