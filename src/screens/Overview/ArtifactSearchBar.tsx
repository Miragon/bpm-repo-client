import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles} from "@material-ui/styles";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, RepositoryTO} from "../../api";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import * as artifactAction from "../../store/actions/artifactAction";
import {RootState} from "../../store/reducers/rootReducer";
import {useTranslation} from "react-i18next";
import helpers from "../../constants/Functions";
import ArtifactListItemRough from "./Holder/ArtifactListItemRough";

const useStyles = makeStyles(() => ({
    headerText: {
        color: "black",
        fontSize: "20px"
    },
    container: {
        width: "800px"
    },
    resultsContainer: {
        marginTop: "15px",
        display: "flex",
        flexWrap: "wrap"
    },
    listItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    artifactName: {
        color: "black",
        flexGrow: 3
    },
    repoName: {
        color: "lightgrey",
    }
}));

let timeout: NodeJS.Timeout | undefined;

const ArtifactSearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation("common");


    const searchedArtifacts: Array<ArtifactTO> = useSelector(
        (state: RootState) => state.artifacts.searchedArtifacts
    );
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const foundDiagrams: number = useSelector((state: RootState) => state.resultsCount.artifactResultsCount);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);


    const [artifact, setArtifact] = useState("");
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<ArtifactTO[]>([]);
    const [displayResult, setDisplayResult] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!open) {
            setResults([]);
        }
        if (open) {
            setResults(searchedArtifacts);
        }
    }, [open, searchedArtifacts, artifact, displayResult]);

    useEffect(() => {
        if (artifact === "") {
            setDisplayResult(false);
            setLoading(false);
        }
    }, [artifact]);

    useEffect(() => {
        if (searchedArtifacts.length > 0) {
            setLoading(false);
        }
        if (foundDiagrams === 0) {
            setLoading(false);
        }
    }, [searchedArtifacts, foundDiagrams]);


    const onChangeWithTimer = ((input: string) => {
        setArtifact(input);
        if (input === "") {
            setDisplayResult(false);
        } else {
            setDisplayResult(true);
        }
        if (input !== "") {
            if (timeout) {
                clearTimeout(timeout);
            }
            setLoading(true);
            timeout = setTimeout(() => fetchArtifactSuggestion(input), 500);
        }
    });

    const fetchArtifactSuggestion = useCallback((input: string) => {
        dispatch(artifactAction.searchArtifact(input));
    }, [dispatch]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateState = (event: any) => {
        onChangeWithTimer(event.target.textContent)
        setArtifact(event.target.textContent);
        setDisplayResult(true);
    };


    return (
        <>
            <div className={classes.container}>
                <ErrorBoundary>
                    <Autocomplete
                        size="small"
                        id="ArtifactSearchBar"
                        freeSolo
                        style={{ width: "100%" }}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={option => `${option.name}`}
                        onChange={updateState}
                        options={results}
                        loading={loading}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={t("search.search")}
                                variant="outlined"
                                onChange={event => onChangeWithTimer(event.target.value)}
                                value={artifact}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {(loading && artifact !== "")
                                                ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20} />
                                                ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }} />
                        )} />
                    {displayResult &&
                        <div className={classes.resultsContainer}>
                            {!loading && searchedArtifacts.map(searchedArtifact => (
                                <div
                                    key={searchedArtifact.id}
                                    className={classes.container}>
                                    <ArtifactListItemRough
                                        artifactTitle={searchedArtifact.name}
                                        createdDate={searchedArtifact.createdDate}
                                        updatedDate={searchedArtifact.updatedDate}
                                        description={searchedArtifact.description}
                                        repoId={searchedArtifact.repositoryId}
                                        artifactId={searchedArtifact.id}
                                        fileType={searchedArtifact.fileType}
                                        favorite={helpers.isFavorite(searchedArtifact.id, favoriteArtifacts?.map(artifact => artifact.id))}
                                        repository={helpers.getRepoName(searchedArtifact.repositoryId, repos)}/>
                                </div>
                            ))}
                            {!loading && searchedArtifacts?.length === 0 && artifact.length > 0 && (
                                <span>{t("search.noResults")}</span>
                            )}
                        </div>
                    }
                </ErrorBoundary>
            </div>
        </>
    );
};

export default ArtifactSearchBar;
