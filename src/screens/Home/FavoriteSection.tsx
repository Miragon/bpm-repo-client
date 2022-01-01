import { makeStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react";
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

const FavoriteArtifacts: React.FC = observer(() => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const repositories = useSelector((state: RootState) => state.repositories);
    const artifactTypes = useSelector((state: RootState) => state.artifactTypes);
    const favoriteArtifacts = useSelector((state: RootState) => state.favoriteArtifacts);

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadArtifactTypes());
        dispatch(loadFavoriteArtifacts());
    }, [dispatch]);

    const files: FileDescription[] = useMemo(() => (favoriteArtifacts.value || []).map(artifact => ({
        ...artifact,
        favorite: true,
        repository: repositories.value?.find(r => r.id === artifact.repositoryId)
    })), [repositories, favoriteArtifacts]);

    return (
        <DefaultFileList
            files={files}
            reloadFiles={() => {
                dispatch(loadFavoriteArtifacts(true));
                dispatch(loadRecentArtifacts(true));
            }}
            className={classes.fileList}
            artifactTypes={artifactTypes.value || []}
            fallback="favorites.notAvailable" />
    );
});

export default FavoriteArtifacts;
