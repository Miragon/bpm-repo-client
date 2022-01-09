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
import { loadRecentArtifacts } from "../../../store/RecentArtifactState";
import { loadRepositories } from "../../../store/RepositoryState";
import { RootState } from "../../../store/Store";
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

const ArtifactRecentSection: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const { t } = useTranslation("common");

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

    // Reload if something changed in the other sections
    useEffect(() => {
        if (props.loadKey > 0) {
            dispatch(loadRepositories(true));
            dispatch(loadArtifactTypes(true));
            dispatch(loadRecentArtifacts(true));
            dispatch(loadFavoriteArtifacts(true));
        }
    }, [dispatch, props.loadKey]);

    const files: FileDescription[] = useMemo(() => (recentArtifacts.value || []).map(artifact => ({
        ...artifact,
        favorite: !!favoriteArtifacts.value?.find(a => a.id === artifact.id),
        repository: repositories.value?.find(r => r.id === artifact.repositoryId)
    })), [recentArtifacts, repositories, favoriteArtifacts]);

    const filtered = useMemo(() => filterArtifactList(props.search, files), [files, props.search]);

    if (repositories.error || artifactTypes.error || recentArtifacts.error || favoriteArtifacts.error) {
        return (
            <PopupToast
                message={t("exception.loadingError")}
                action={retryAction(() => {
                    repositories.error && dispatch(loadRepositories(true));
                    artifactTypes.error && dispatch(loadArtifactTypes(true));
                    recentArtifacts.error && dispatch(loadRecentArtifacts(true));
                    favoriteArtifacts.error && dispatch(loadFavoriteArtifacts(true));
                })} />
        );
    }

    if (props.hideWhenNoneFound !== false && props.search && filtered.length === 0) {
        return null;
    }

    return (
        <>
            <ScreenSectionHeader title={t("artifact.recent")} />
            <DefaultFileList
                files={filtered}
                pageSize={props.pageSize}
                reloadFiles={props.onChange}
                className={classes.fileList}
                artifactTypes={artifactTypes.value || []}
                fallback="artifact.noRecent" />
        </>
    );
};

export default ArtifactRecentSection;
