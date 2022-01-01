import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultFileList from "../../components/Layout/Files/DefaultFileList";
import { FileDescription } from "../../components/Layout/Files/FileListEntry";
import { loadArtifactTypes } from "../../store/ArtifactTypeState";
import { loadFavoriteArtifacts } from "../../store/FavoriteArtifactState";
import { loadRecentArtifacts } from "../../store/RecentArtifactState";
import { RootState } from "../../store/reducers/rootReducer";
import { loadRepositories } from "../../store/RepositoryState";

const useStyles = makeStyles({
    fileList: {
        marginBottom: "1rem"
    }
});

const RecentArtifacts: React.FC = (() => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const repositories = useSelector((state: RootState) => state.repositories);
    const artifactTypes = useSelector((state: RootState) => state.artifactTypes);
    const recentArtifacts = useSelector((state: RootState) => state.recentArtifacts);
    const favoriteArtifacts = useSelector((state: RootState) => state.favoriteArtifacts);

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadArtifactTypes());
        dispatch(loadRecentArtifacts());
        dispatch(loadFavoriteArtifacts());
    }, [dispatch]);

    const files: FileDescription[] = useMemo(() => (recentArtifacts.value || []).map(artifact => ({
        ...artifact,
        favorite: !!favoriteArtifacts.value?.find(a => a.id === artifact.id),
        repository: repositories.value?.find(r => r.id === artifact.repositoryId)
    })), [recentArtifacts, repositories, favoriteArtifacts]);

    return (
        <DefaultFileList
            files={files}
            reloadFiles={() => {
                dispatch(loadFavoriteArtifacts(true));
                dispatch(loadRecentArtifacts(true));
            }}
            className={classes.fileList}
            artifactTypes={artifactTypes.value || []}
            fallback="recents.notAvailable" />
    );
});

export default RecentArtifacts;
