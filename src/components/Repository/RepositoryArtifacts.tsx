import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { ArtifactTO, ArtifactTypeTO, RepositoryTO } from "../../api";
import { RootState } from "../../store/reducers/rootReducer";
import { FAVORITE_ARTIFACTS, SYNC_STATUS_ARTIFACT } from "../../constants/Constants";
import { fetchFavoriteArtifacts } from "../../store/actions";
import DropdownButton, { DropdownButtonItem } from "../Shared/Form/DropdownButton";
import SimpleButton from "../Shared/Form/SimpleButton";
import ArtifactManagementContainer from "../Shared/Buttons/ArtifactManagementContainer";
import DeployMultipleDialog from "./Dialogs/DeployMultipleDialog";
import ArtifactListWithMilestones from "../Artifact/ArtifactListWithMilestones";
import { makeErrorToast } from "../../util/toastUtils";
import { compareCreated, compareEdited, compareName } from "../../util/compareUtils";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        marginTop: "15px"
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "0px"
    },
    buttonGroup: {
        display: "flex"
    },
    button: {
        marginRight: "0.5rem"
    },
    types: {
        display: "flex",
        flexDirection: "column"
    },
    dropdownButton: {
        minWidth: "200px"
    }
}));

interface Props {
    view: "repository" | "team";
    artifacts: Array<ArtifactTO>;
    id: string;
}

const RepositoryArtifacts: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");
    const { repoId } = useParams<{ repoId: string }>();
    const favoriteSynced: boolean = useSelector((state: RootState) => state.dataSynced.favoriteSynced);
    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);

    const [deployMultipleOpen, setDeployMultipleOpen] = useState(false);
    const [displayedFileTypes, setDisplayedFileTypes] = useState<Array<string>>(fileTypes.map(type => type.name));
    const [sortValue, setSortValue] = useState<string>("lastEdited");

    const fetchFavorite = useCallback(() => {
        fetchFavoriteArtifacts().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: FAVORITE_ARTIFACTS, favoriteArtifacts: response.data });
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true });
            } else {
                makeErrorToast(t(response.data.toString()), () => fetchFavorite());
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchFavorite());
        });
    }, [dispatch, t]);

    useEffect(() => {
        if (!favoriteSynced) {
            fetchFavorite();
        }
    }, [favoriteSynced, fetchFavorite]);

    const sortArtifacts = (value: string, artifacts: Array<ArtifactTO>) : Array<ArtifactTO> => {
        switch (value) {
            case "lastEdited":
                return artifacts.sort(compareEdited);
            case "name":
                return artifacts.sort(compareName);
            default:
                return artifacts.sort(compareCreated);
        }
    };

    const filteredArtifacts = useMemo(() => {
        const filtered = props.artifacts.filter(artifact => displayedFileTypes.includes(artifact.fileType));
        return sortArtifacts(sortValue, filtered);
    }, [props.artifacts, sortValue, displayedFileTypes]);

    const changeFileTypeFilter = (selectedValue: string) => {
        const currentList = [...displayedFileTypes];
        if (displayedFileTypes.find(fileType => fileType === selectedValue)) {
            currentList.splice(currentList.indexOf(selectedValue), 1);
        } else {
            currentList.push(selectedValue);
        }
        setDisplayedFileTypes(currentList);
    };

    const filterOptions: DropdownButtonItem[] = [];
    fileTypes.map(fileType => (
        filterOptions.push(
            {
                id: fileType.name,
                label: t(`artifact.type.${fileType.name}`),
                type: "button",
                onClick: () => {
                    changeFileTypeFilter(fileType.name);
                }
            }
        )
    ));

    const sortOptions: DropdownButtonItem[] = [
        {
            id: "created",
            label: t("sort.created"),
            type: "button",
            onClick: () => {
                setSortValue("created");
            }
        },
        {
            id: "lastEdited",
            label: t("sort.lastEdited"),
            type: "button",
            onClick: () => {
                setSortValue("lastEdited");
            }
        },
        {
            id: "name",
            label: t("sort.name"),
            type: "button",
            onClick: () => {
                setSortValue("name");
            }
        },
    ];

    return (
        <>
            <div className={classes.buttonContainer}>
                <div className={classes.buttonGroup}>
                    <DropdownButton
                        className={clsx(classes.button, classes.dropdownButton)}
                        title={t("filter.filter")}
                        options={filterOptions}
                        type="checkbox"
                        selectedFilterOptions={displayedFileTypes} />
                    <DropdownButton
                        className={classes.dropdownButton}
                        title={t("sort.sort")}
                        options={sortOptions}
                        type="radio"
                        defaultSortValue="lastEdited" />
                </div>
                <div className={classes.buttonGroup}>
                    <SimpleButton
                        className={classes.button}
                        title={t("deployment.multiple")}
                        onClick={() => setDeployMultipleOpen(true)} />
                    {
                        props.view === "team" ? <></> : <ArtifactManagementContainer />
                    }
                </div>
            </div>

            <div className={classes.container}>
                <ArtifactListWithMilestones
                    repoId={repoId}
                    artifacts={filteredArtifacts}
                    repositories={repos}
                    favorites={favoriteArtifacts} />
            </div>

            <DeployMultipleDialog
                artifacts={props.artifacts}
                open={deployMultipleOpen}
                onCancelled={() => setDeployMultipleOpen(false)}
                repoId={repoId} />
        </>
    );
};

export default RepositoryArtifacts;
