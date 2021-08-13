import {makeStyles} from "@material-ui/styles";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, ArtifactTypeTO} from "../../../api";
import {fetchArtifactsFromRepo, fetchFavoriteArtifacts} from "../../../store/actions";
import {RootState} from "../../../store/reducers/rootReducer";
import {useParams} from "react-router";
import ArtifactManagementContainer from "../Administration/ArtifactManagementContainer";
import DropdownButton, {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import {useTranslation} from "react-i18next";
import {SYNC_STATUS_FAVORITE} from "../../../store/constants";
import ArtifactListItem from "./ArtifactListItem";
import {List} from "@material-ui/core";
import helpers from "../../../constants/Functions";



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
    types: {
        display: "flex",
        flexDirection: "column"
    },
    filter: {
        marginRight: "25px"
    }
}));

const ArtifactDetails: React.FC = (() => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const { repoId } = useParams<{ repoId: string }>();
    const activeArtifacts: Array<ArtifactTO> = useSelector(
        (state: RootState) => state.artifacts.artifacts
    );
    const synced = useSelector((state: RootState) => state.dataSynced.artifactSynced);
    const favoriteSynced = useSelector((state: RootState) => state.dataSynced.favoriteSynced);
    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);


    const [displayedFileTypes, setDisplayedFileTypes] = useState<Array<string>>(fileTypes.map(type => type.name));
    const [filteredArtifacts, setFilteredArtifacts] = useState<Array<ArtifactTO>>(activeArtifacts);
    const [sortValue, setSortValue] = useState<string>("lastEdited");

    useEffect(() => {
        dispatch(fetchArtifactsFromRepo(repoId));
    }, [dispatch, repoId]);

    useEffect(() => {
        if (!synced) {
            dispatch(fetchArtifactsFromRepo(repoId));
        }
    }, [dispatch, synced, repoId]);



    useEffect(() => {
        setFilteredArtifacts(activeArtifacts)
    }, [activeArtifacts, fileTypes])

    useEffect(() => {
        if(!favoriteSynced){
            dispatch(fetchFavoriteArtifacts());
            dispatch({type: SYNC_STATUS_FAVORITE, dataSynced: true})
        }
    }, [favoriteSynced, dispatch, ]);



    const changeFileTypeFilter = (selectedValue: string) => {
        const currentList = displayedFileTypes
        if(displayedFileTypes.find(fileType => fileType === selectedValue)){
            currentList.splice(currentList.indexOf(selectedValue), 1)
        }
        else{
            currentList.push(selectedValue)
        }
        setDisplayedFileTypes(currentList)
        applyFilters()
    }

    const applyFilters = () => {
        const filtered = activeArtifacts.filter(artifact => displayedFileTypes.includes(artifact.fileType))
        sort(sortValue, filtered)
    }


    const sort = (value: string, artifacts: Array<ArtifactTO>) => {
        switch (value){
            case "created":
                setSortValue("created")
                setFilteredArtifacts(artifacts.sort(compareCreated));
                return;
            case "lastEdited":
                setSortValue("lastEdited")
                setFilteredArtifacts(artifacts.sort(compareEdited));
                return;
            case "name":
                setSortValue("name")
                setFilteredArtifacts(artifacts.sort(compareName));
                return;
        }
    }

    const compareCreated = (a: ArtifactTO, b: ArtifactTO) => {
        const c = new Date(a.createdDate)
        const d = new Date(b.createdDate)
        if(c < d) {
            return 1;
        }
        if(c > d) {
            return -1;
        }
        return 0;
    }
    const compareEdited = (a: ArtifactTO, b: ArtifactTO) => {
        const c = new Date(a.updatedDate)
        const d = new Date(b.updatedDate)
        if(c < d) {
            return 1;
        }
        if(c > d) {
            return -1;
        }
        return 0;
    }
    const compareName = (a: ArtifactTO, b: ArtifactTO) => {
        if(a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        if(a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    }


    const filterOptions: DropdownButtonItem[] = [];
    fileTypes.map(fileType => (
        filterOptions.push(
            {
                id: fileType.name,
                label: fileType.name,
                type: "button",
                onClick: () => {
                    changeFileTypeFilter(fileType.name)
                }
            }
        )
    ))

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
    ]


    return (
        <>
            <div className={classes.buttonContainer}>
                <div >
                    <DropdownButton className={classes.filter} title={t("filter.filter")} options={filterOptions} type={"checkbox"} selectedFilterOptions={displayedFileTypes} />
                    <DropdownButton title={t("sort.sort")} options={sortOptions} type={"radio"} defaultSortValue={"lastEdited"}/>
                </div>
                <ArtifactManagementContainer/>
            </div>

            <div className={classes.container}>
                <List>
                    {filteredArtifacts.map(artifact => (
                        <ArtifactListItem
                            key={artifact.id}
                            artifactTitle={artifact.name}
                            createdDate={artifact.createdDate}
                            updatedDate={artifact.updatedDate}
                            description={artifact.description}
                            repoId={artifact.repositoryId}
                            favorite={helpers.isFavorite(artifact.id, favoriteArtifacts?.map(artifact => artifact.id))}
                            artifactId={artifact.id}
                            fileType={artifact.fileType} />
                    ))}
                </List>
            </div>
        </>
    );
});
export default ArtifactDetails;