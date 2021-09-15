import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { ArtifactTO, ArtifactTypeTO, RepositoryTO } from "../../../api";
import DropdownButton, { DropdownButtonItem } from "../../../components/Form/DropdownButton";
import SimpleButton from "../../../components/Form/SimpleButton";
import {
    ACTIVE_ARTIFACTS,
    FAVORITE_ARTIFACTS,
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_FAVORITE
} from "../../../constants/Constants";
import { fetchArtifactsFromRepo, fetchFavoriteArtifacts } from "../../../store/actions";
import { RootState } from "../../../store/reducers/rootReducer";
import helpers from "../../../util/helperFunctions";
import ArtifactManagementContainer from "../Buttons/ArtifactManagementContainer";
import RepositoryArtifactList from "../RepositoryArtifactList";
import DeployMultipleDialog from "../RepositoryDetails/Dialogs/DeployMultipleDialog";


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

const ArtifactDetails: React.FC = (() => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const { repoId } = useParams<{ repoId: string }>();
    const activeArtifacts: Array<ArtifactTO> = useSelector(
        (state: RootState) => state.artifacts.artifacts
    );
    const artifactSynced = useSelector((state: RootState) => state.dataSynced.artifactSynced);
    const favoriteSynced = useSelector((state: RootState) => state.dataSynced.favoriteSynced);
    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);

    const [deployMultipleOpen, setDeployMultipleOpen] = useState(false);
    const [displayedFileTypes, setDisplayedFileTypes] = useState<Array<string>>(fileTypes.map(type => type.name));
    const [filteredArtifacts, setFilteredArtifacts] = useState<Array<ArtifactTO>>(activeArtifacts);
    const [sortValue, setSortValue] = useState<string>("lastEdited");

    const fetchFromRepo = useCallback(async () => {
        fetchArtifactsFromRepo(repoId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ACTIVE_ARTIFACTS, artifacts: response.data });
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true });
                dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: true })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchFromRepo())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchFromRepo())
        })
    }, [dispatch, repoId, t])

    const fetchFavorite = useCallback(() => {
        fetchFavoriteArtifacts().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: FAVORITE_ARTIFACTS, favoriteArtifacts: response.data });
                dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: true })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchFavorite())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchFavorite())
        })

    }, [dispatch, t]);

    useEffect(() => {
        if (!artifactSynced) {
            fetchFromRepo()
        }
    }, [artifactSynced, repoId, fetchFromRepo]);

    useEffect(() => {
        if (!favoriteSynced) {
            fetchFavorite()
        }
    }, [favoriteSynced, fetchFavorite]);


    const changeFileTypeFilter = (selectedValue: string) => {
        const currentList = [...displayedFileTypes];
        if (displayedFileTypes.find(fileType => fileType === selectedValue)) {
            currentList.splice(currentList.indexOf(selectedValue), 1)
        } else {
            currentList.push(selectedValue)
        }
        setDisplayedFileTypes(currentList)
        applyFilters()
    }

    //TODO: filteredAndSortedArtifacts ist Alex's vorschlag, um die Sortierfunktion zu vereinfachen
    /*
     const filteredAndSortedArtifacts = useMemo(() => {
     const filtered = activeArtifacts.filter(artifact => displayedFileTypes.indexOf(artifact.fileType) !== -1);
     switch(sortValue) {
     case "created": return filtered.sort(helpers.compareCreated);
     case "lastEdited": return filtered.sort(helpers.compareEdited);
     case "name": return filtered.sort(helpers.compareName);
     }
     }, [activeArtifacts, displayedFileTypes, sortValue]);
     */

    const applyFilters = useCallback(() => {
        const filtered = activeArtifacts.filter(artifact => displayedFileTypes.includes(artifact.fileType))
        sort(sortValue, filtered)
    }, [activeArtifacts, displayedFileTypes, sortValue])

    useEffect(() => {
        applyFilters()
    }, [activeArtifacts, applyFilters])

    const sort = (value: string, artifacts: Array<ArtifactTO>) => {
        switch (value) {
            case "created":
                setSortValue("created")
                setFilteredArtifacts(artifacts.sort(helpers.compareCreated));
                return;
            case "lastEdited":
                setSortValue("lastEdited")
                setFilteredArtifacts(artifacts.sort(helpers.compareEdited));
                return;
            case "name":
                setSortValue("name")
                setFilteredArtifacts(artifacts.sort(helpers.compareName));
                return;
        }
    };

    const filterOptions: DropdownButtonItem[] = [];
    fileTypes.map(fileType => (
        filterOptions.push(
            {
                id: fileType.name,
                label: t(`artifact.type.${fileType.name}`),
                type: "button",
                onClick: () => {
                    changeFileTypeFilter(fileType.name)
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
                sort("created", filteredArtifacts)
            }
        },
        {
            id: "lastEdited",
            label: t("sort.lastEdited"),
            type: "button",
            onClick: () => {
                sort("lastEdited", filteredArtifacts)
            }
        },
        {
            id: "name",
            label: t("sort.name"),
            type: "button",
            onClick: () => {
                sort("name", filteredArtifacts)

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
                        type={"checkbox"}
                        selectedFilterOptions={displayedFileTypes} />
                    <DropdownButton
                        className={classes.dropdownButton}
                        title={t("sort.sort")}
                        options={sortOptions}
                        type={"radio"}
                        defaultSortValue={"lastEdited"} />
                </div>
                <div className={classes.buttonGroup}>
                    <SimpleButton
                        className={classes.button}
                        title={t("deployment.multiple")}
                        onClick={() => setDeployMultipleOpen(true)} />
                    <ArtifactManagementContainer />
                </div>
            </div>

            <div className={classes.container}>
                <RepositoryArtifactList
                    artifacts={filteredArtifacts}
                    repositories={repos}
                    favorites={favoriteArtifacts} />
            </div>

            <DeployMultipleDialog
                artifacts={activeArtifacts}
                open={deployMultipleOpen}
                onCancelled={() => setDeployMultipleOpen(false)}
                repoId={repoId} />
        </>
    );
});
export default ArtifactDetails;
