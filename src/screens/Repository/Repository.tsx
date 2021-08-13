import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {getSingleRepository} from "../../store/actions";
import ArtifactDetails from "./Artifact/ArtifactDetails";
import RepositoryDetails from "./Administration/RepositoryDetails";
import {RepositoryTO} from "../../api";
import {RootState} from "../../store/reducers/rootReducer";
import PathStructure from "../../components/Layout/PathStructure";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import SharedArtifacts from "./Artifact/SharedArtifacts";

const Repository: React.FC = (() => {
    const dispatch = useDispatch();

    const { repoId } = useParams<{ repoId: string }>();
    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);
    const dataSynced: boolean = useSelector((state: RootState) => state.dataSynced.activeRepoSynced);

    const getRepo = useCallback((repositoryId: string) => {
        dispatch(getSingleRepository(repositoryId));
    }, [dispatch]);


    useEffect(() => {
        dispatch(getSingleRepository(repoId));
    }, [dispatch, getRepo, repoId])

    useEffect(() => {
        if(!dataSynced){
            getRepo(repoId);
        }
    }, [dataSynced, getRepo, repoId])

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
                    <SharedArtifacts/>

                </div>
            }
        </>
    );
});

export default Repository;
