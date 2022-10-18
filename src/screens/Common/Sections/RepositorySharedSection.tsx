import { makeStyles } from "@material-ui/core/styles";
import { LocalShippingOutlined } from "@material-ui/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DetailFileList from "../../../components/Files/DetailFileList";
import { FileDescription } from "../../../components/Files/FileListEntry";
import { PopupToast, retryAction } from "../../../components/Form/PopupToast";
import ActionButton from "../../../components/Header/ActionButton";
import FilterButton from "../../../components/Header/FilterButton";
import ScreenSectionHeader from "../../../components/Header/ScreenSectionHeader";
import SortButton from "../../../components/Header/SortButton";
import DownloadButton from "../../../components/Header/DownloadButton";
import { loadArtifactTypes } from "../../../store/ArtifactTypeState";
import { loadDeploymentTargets } from "../../../store/DeploymentTargetState";
import { loadFavoriteArtifacts } from "../../../store/FavoriteArtifactState";
import { loadOwnRepositories } from "../../../store/OwnRepositoryState";
import { loadRepositories } from "../../../store/RepositoryState";
import { loadSharedArtifacts } from "../../../store/SharedArtifactState";
import { RootState } from "../../../store/Store";
import { getFilterConfig, getSortConfig } from "../../../util/MenuUtils";
import { filterArtifactList } from "../../../util/SearchUtils";
import { sortByString } from "../../../util/SortUtils";
import DeployArtifactsDialog from "../Dialogs/DeployArtifactsDialog";
import {apiExec, hasFailed} from "../../../util/ApiUtils";
import {RepositoryApi} from "../../../api";
import {makeErrorToast, makeSuccessToast} from "../../../util/ToastUtils";
import {downloadFile} from "../../../util/FileUtils";

const useStyles = makeStyles({
    fileList: {
        marginBottom: "1rem"
    },
    pagination: {
        marginBottom: "2rem"
    },
    headerActions: {
        flexGrow: 1,
        display: "flex",
        justifyContent: "flex-end",
        marginRight: "-1rem"
    }
});

interface Props {
    search: string;
    loadKey: number;
    onChange: () => void;
    repositoryId: string;
}

const RepositorySharedSection: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const { t } = useTranslation("common");

    const [deployArtifactsOpen, setDeployArtifactsOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [activeSort, setActiveSort] = useState("name");

    const repositories = useSelector((state: RootState) => state.repositories);
    const artifactTypes = useSelector((state: RootState) => state.artifactTypes);
    const ownRepositories = useSelector((state: RootState) => state.ownRepositories);
    const favoriteArtifacts = useSelector((state: RootState) => state.favoriteArtifacts);
    const deploymentTargets = useSelector((state: RootState) => state.deploymentTargets);
    const sharedArtifacts = useSelector((state: RootState) => state.sharedArtifacts.values[props.repositoryId]);

    const files: FileDescription[] = useMemo(() => (sharedArtifacts?.value || []).map(artifact => ({
        ...artifact,
        favorite: !!favoriteArtifacts.value?.find(a => a.id === artifact.id),
        repository: repositories.value?.find(r => r.id === artifact.repositoryId)
    })), [sharedArtifacts, repositories, favoriteArtifacts]);

    const filterConfig = useMemo(
        () => getFilterConfig(artifactTypes.value || [], t),
        [artifactTypes, t]
    );

    const sortConfig = useMemo(() => getSortConfig(t), [t]);

    useEffect(() => {
        if (artifactTypes.value) {
            setActiveFilters(artifactTypes.value.map(type => type.name.toLowerCase()));
        }
    }, [artifactTypes.value]);

    const filtered = useMemo(() => {
        const filteredArtifacts = filterArtifactList(props.search, files)
            .filter(file => activeFilters.indexOf(file.fileType.toLowerCase()) !== -1);
        const sorted = sortByString(filteredArtifacts, artifact => {
            switch (activeSort) {
                case "editedAt": {
                    return artifact.updatedDate;
                }
                case "createdAt": {
                    return artifact.createdDate;
                }
                case "type": {
                    // First by type, then by name
                    return artifact.fileType + artifact.name;
                }
                default:
                case "name": {
                    return artifact.name;
                }
            }
        });
        // Make sure the newest files are on top
        if (activeSort === "createdAt" || activeSort === "editedAt") {
            return sorted.reverse();
        }
        return sorted;
    }, [activeSort, files, props.search, activeFilters]);

    const changeFilter = useCallback((value: string, active: boolean) => {
        setActiveFilters(cur => {
            if (active) {
                // Make sure the file type is only ever once in this list
                return cur.filter(v => v !== value).concat(value);
            }
            return cur.filter(v => v !== value);
        });
    }, []);

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadArtifactTypes());
        dispatch(loadOwnRepositories());
        dispatch(loadFavoriteArtifacts());
        dispatch(loadDeploymentTargets());
        if (props.repositoryId) {
            dispatch(loadSharedArtifacts(props.repositoryId));
        }
    }, [dispatch, props.repositoryId]);

    // Reload if something changed in the other sections
    useEffect(() => {
        if (props.loadKey > 0) {
            dispatch(loadRepositories(true));
            dispatch(loadArtifactTypes(true));
            dispatch(loadOwnRepositories(true));
            dispatch(loadFavoriteArtifacts(true));
            dispatch(loadDeploymentTargets(true));
        }
    }, [dispatch, props.loadKey]);

    // Reload if something changed in the other sections
    useEffect(() => {
        if (props.loadKey > 0 && props.repositoryId) {
            dispatch(loadSharedArtifacts(props.repositoryId, true));
        }
    }, [dispatch, props.loadKey, props.repositoryId]);

    /**
     * Downloads all artifact of the selected repository
     **/
    const download = useCallback(async () => {
        const response = await apiExec(RepositoryApi, api => api.zipDownloadProject(props.repositoryId));
        if (hasFailed(response)) {
            if (response.error) {
                makeErrorToast(t(response.error));
            } else {
                makeErrorToast(t("artifact.downloadFailed"));
            }
            return;
        }

        downloadFile(response.result);
        makeSuccessToast(t("artifact.downloadStarted"));
    }, [props.repositoryId, t]);

    if (repositories.error
        || artifactTypes.error
        || ownRepositories.error
        || favoriteArtifacts.error
        || deploymentTargets.error
        || sharedArtifacts?.error) {
        return (
            <PopupToast
                message={t("exception.loadingError")}
                action={retryAction(() => {
                    repositories.error && dispatch(loadRepositories(true));
                    artifactTypes.error && dispatch(loadArtifactTypes(true));
                    ownRepositories.error && dispatch(loadOwnRepositories(true));
                    favoriteArtifacts.error && dispatch(loadFavoriteArtifacts(true));
                    deploymentTargets.error && dispatch(loadDeploymentTargets(true));
                    if (props.repositoryId) {
                        sharedArtifacts?.error && dispatch(loadSharedArtifacts(props.repositoryId, true));
                    }
                })} />
        );
    }

    if (files.length === 0) {
        return null;
    }

    return (
        <>
            <ScreenSectionHeader title={t("repository.shared")}>
                <div className={classes.headerActions}>
                    <DownloadButton
                        onDownloadClick={download}/>
                    <ActionButton
                        label={t("milestone.deployMultiple")}
                        icon={LocalShippingOutlined}
                        onClick={() => setDeployArtifactsOpen(true)}
                        active={false}
                        primary />
                    <SortButton
                        active={activeSort}
                        sortOptions={sortConfig}
                        onChange={setActiveSort} />
                    <FilterButton
                        active={activeFilters}
                        filterOptions={filterConfig}
                        onChange={changeFilter} />
                </div>
            </ScreenSectionHeader>
            <DetailFileList
                targets={deploymentTargets.value || []}
                files={filtered}
                fallback="repository.noShared"
                reloadFiles={props.onChange}
                className={classes.fileList}
                paginationClassName={classes.pagination}
                ownRepositories={ownRepositories.value || []}
                repositories={repositories.value || []}
                artifactTypes={artifactTypes.value || []} />
            <DeployArtifactsDialog
                open={deployArtifactsOpen}
                onClose={() => setDeployArtifactsOpen(false)}
                repositoryId={props.repositoryId}
                artifacts={files}
                artifactTypes={artifactTypes.value || []}
                targets={deploymentTargets.value || []} />
        </>
    );
};

export default RepositorySharedSection;
