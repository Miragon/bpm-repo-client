import { makeStyles } from "@material-ui/core/styles";
import { LocalShippingOutlined } from "@material-ui/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DetailFileList from "../../../components/Files/DetailFileList";
import { FileDescription } from "../../../components/Files/FileListEntry";
import ActionButton from "../../../components/Header/ActionButton";
import FilterButton from "../../../components/Header/FilterButton";
import ScreenSectionHeader from "../../../components/Header/ScreenSectionHeader";
import SortButton from "../../../components/Header/SortButton";
import { loadArtifactTypes } from "../../../store/ArtifactTypeState";
import { loadDeploymentTargets } from "../../../store/DeploymentTargetState";
import { loadFavoriteArtifacts } from "../../../store/FavoriteArtifactState";
import { loadOwnRepositories } from "../../../store/OwnRepositoryState";
import { loadRepositoryArtifacts } from "../../../store/RepositoryArtifactState";
import { loadRepositories } from "../../../store/RepositoryState";
import { RootState } from "../../../store/Store";
import { filterArtifactList } from "../../../util/SearchUtils";
import { sortByString } from "../../../util/SortUtils";
import DeployArtifactsDialog from "../Dialogs/DeployArtifactsDialog";

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

const FILTER_CONFIG = [
    [
        { value: "bpmn", label: "BPMN-Dateien" },
        { value: "dmn", label: "DMN-Dateien" },
        { value: "configuration", label: "Konfigurationen" },
        { value: "form", label: "Formulare" }
    ]
];

const SORT_CONFIG = [
    [
        { value: "createdAt", label: "Erstellt" },
        { value: "editedAt", label: "Zuletzt bearbeitet" },
        { value: "name", label: "Name" },
        { value: "type", label: "Typ" }
    ]
];

const RepositoryFilesSection: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const { t } = useTranslation("common");

    const [deployArtifactsOpen, setDeployArtifactsOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState(["bpmn", "dmn", "form", "configuration"]);
    const [activeSort, setActiveSort] = useState("name");

    const repositories = useSelector((state: RootState) => state.repositories);
    const artifactTypes = useSelector((state: RootState) => state.artifactTypes);
    const ownRepositories = useSelector((state: RootState) => state.ownRepositories);
    const favoriteArtifacts = useSelector((state: RootState) => state.favoriteArtifacts);
    const deploymentTargets = useSelector((state: RootState) => state.deploymentTargets);
    const repositoryArtifacts = useSelector((state: RootState) => state.repositoryArtifacts.values[props.repositoryId]);

    const files: FileDescription[] = useMemo(() => (repositoryArtifacts?.value || []).map(artifact => ({
        ...artifact,
        favorite: !!favoriteArtifacts.value?.find(a => a.id === artifact.id),
        repository: repositories.value?.find(r => r.id === artifact.repositoryId)
    })), [repositoryArtifacts, repositories, favoriteArtifacts]);

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
            dispatch(loadRepositoryArtifacts(props.repositoryId));
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
            dispatch(loadRepositoryArtifacts(props.repositoryId, true));
        }
    }, [dispatch, props.loadKey, props.repositoryId]);

    return (
        <>
            <ScreenSectionHeader title="Projektdateien">
                <div className={classes.headerActions}>
                    <ActionButton
                        label={t("deployment.multiple")}
                        icon={LocalShippingOutlined}
                        onClick={() => setDeployArtifactsOpen(true)}
                        active={false}
                        primary />
                    <SortButton
                        active={activeSort}
                        sortOptions={SORT_CONFIG}
                        onChange={setActiveSort} />
                    <FilterButton
                        active={activeFilters}
                        filterOptions={FILTER_CONFIG}
                        onChange={changeFilter} />
                </div>
            </ScreenSectionHeader>
            <DetailFileList
                targets={deploymentTargets.value || []}
                files={filtered}
                fallback="artifact.notAvailable"
                reloadFiles={props.onChange}
                className={classes.fileList}
                paginationClassName={classes.pagination}
                ownRepositories={ownRepositories.value || []}
                repositories={repositories.value || []}
                artifactTypes={artifactTypes.value || []} />
            <DeployArtifactsDialog
                open={deployArtifactsOpen}
                onClose={deployed => {
                    setDeployArtifactsOpen(false);
                    deployed && props.onChange();
                }}
                repositoryId={props.repositoryId}
                artifacts={files}
                targets={deploymentTargets.value || []} />
        </>
    );
};

export default RepositoryFilesSection;
