import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultFileList from "../../../components/Layout/Files/DefaultFileList";
import { FileDescription } from "../../../components/Layout/Files/FileListEntry";
import ScreenSectionHeader from "../../../components/Layout/Header/ScreenSectionHeader";
import { loadArtifactTypes } from "../../../store/ArtifactTypeState";
import { loadFavoriteArtifacts } from "../../../store/FavoriteArtifactState";
import { RootState } from "../../../store/reducers/rootReducer";
import { loadRepositories } from "../../../store/RepositoryState";
import { filterArtifactList } from "../../../util/SearchUtils";

const useStyles = makeStyles({
    fileList: {
        marginBottom: "1rem"
    }
});

interface Props {
    pageSize?: number;
    hideWhenNoneFound?: boolean;
    search: string;
    loadKey: number;
    onChange: () => void;
}

const ArtifactFavoriteSection: React.FC<Props> = props => {
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

    // Reload if something changed in the other sections
    useEffect(() => {
        if (props.loadKey > 0) {
            dispatch(loadRepositories(true));
            dispatch(loadArtifactTypes(true));
            dispatch(loadFavoriteArtifacts(true));
        }
    }, [dispatch, props.loadKey]);

    const files: FileDescription[] = useMemo(() => (favoriteArtifacts.value || []).map(artifact => ({
        ...artifact,
        favorite: true,
        repository: repositories.value?.find(r => r.id === artifact.repositoryId)
    })), [repositories, favoriteArtifacts]);

    const filtered = useMemo(() => filterArtifactList(props.search, files), [files, props.search]);

    if (props.hideWhenNoneFound !== false && props.search && filtered.length === 0) {
        return null;
    }

    return (
        <>
            <ScreenSectionHeader title="Alle Favoriten" />
            <DefaultFileList
                files={filtered}
                pageSize={props.pageSize}
                reloadFiles={props.onChange}
                className={classes.fileList}
                artifactTypes={artifactTypes.value || []}
                fallback="favorites.notAvailable" />
        </>
    );
};

export default ArtifactFavoriteSection;
