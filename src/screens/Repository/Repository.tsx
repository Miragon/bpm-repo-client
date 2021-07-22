import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {getSingleRepository} from "../../store/actions";
import CreateArtifactContainer from "./Artifact/CreateArtifactContainer";
import ArtifactDetails from "./Artifact/ArtifactDetails";
import RepositoryDetails from "./Administration/RepositoryDetails";
import {RepositoryTO} from "../../api/models";
import {RootState} from "../../store/reducers/rootReducer";
import PathStructure from "../../components/Layout/PathStructure";

const Repository: React.FC = (() => {
    const dispatch = useDispatch();

    const { repoId } = useParams<{ repoId: string }>();
    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);
    const dataSynced: boolean = useSelector((state: RootState) => state.dataSynced.activeRepoSynced);

    const getRepo = useCallback((repositoryId: string) => {
        dispatch(getSingleRepository(repositoryId));
    }, [dispatch]);


    useEffect(() => {
        if(!dataSynced){
            getRepo(repoId);
        }
    }, [dataSynced, getRepo, repoId])

    const element = {
        name: "Overview",
        link: "/"
    }
    const element2 = {
        name: "Repository",
        link: `/repository/${repoId}`
    }
    const path = [element, element2]


    return (
        <>
            {(activeRepo && activeRepo.id === repoId) &&
                <div className={"content"}>
                    <PathStructure structure={path} />
                    <RepositoryDetails/>
                    <CreateArtifactContainer/>
                    <ArtifactDetails/>
                </div>
            }
        </>
    );
});

export default Repository;
