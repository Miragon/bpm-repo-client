import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DefaultFileList from "../../../components/Files/DefaultFileList";
import { FileDescription } from "../../../components/Files/FileListEntry";
import { PopupToast, retryAction } from "../../../components/Form/PopupToast";
import ScreenSectionHeader from "../../../components/Header/ScreenSectionHeader";
import { loadArtifactTypes } from "../../../store/ArtifactTypeState";
import { loadFavoriteArtifacts } from "../../../store/FavoriteArtifactState";
import { loadRepositories } from "../../../store/RepositoryState";
import { RootState } from "../../../store/Store";
import { filterArtifactList } from "../../../util/SearchUtils";
import { sortByString } from "../../../util/SortUtils";

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

    const { t } = useTranslation("common");

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

    const filtered = useMemo(() => sortByString(
        filterArtifactList(props.search, files),
        artifact => artifact.name), [files, props.search]);

    if (repositories.error || artifactTypes.error || favoriteArtifacts.error) {
        return (
            <PopupToast
                message={t("exception.loadingError")}
                action={retryAction(() => {
                    repositories.error && dispatch(loadRepositories(true));
                    artifactTypes.error && dispatch(loadArtifactTypes(true));
                    favoriteArtifacts.error && dispatch(loadFavoriteArtifacts(true));
                })} />
        );
    }

    if (props.hideWhenNoneFound !== false && props.search && filtered.length === 0) {
        return null;
    }

    return (
        <>
            <ScreenSectionHeader title={t("artifact.favorites")} />
            <DefaultFileList
                files={filtered}
                pageSize={props.pageSize}
                reloadFiles={props.onChange}
                className={classes.fileList}
                artifactTypes={artifactTypes.value || []}
                fallback="artifact.noFavorites" />
        </>
    );
};

export default ArtifactFavoriteSection;
