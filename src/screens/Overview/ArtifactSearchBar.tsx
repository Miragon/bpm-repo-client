import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles} from "@material-ui/styles";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, RepositoryTO} from "../../api/models";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import * as artifactAction from "../../store/actions/artifactAction";
import {RootState} from "../../store/reducers/rootReducer";
import ArtifactCard from "./Holder/ArtifactCard";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    headerText: {
        color: "black",
        fontSize: "20px"
    },
    container: {
        flexGrow: 1,
        marginRight: "6rem"
    },
    resultsContainer: {
        marginTop: "15px",
        display: "flex",
        flexWrap: "wrap"
    },
    card: {
        width: "calc(20%)",
        "&:nth-child(5n)>div": {
            marginRight: 0
        }
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
    const results: number = useSelector((state: RootState) => state.resultsCount.artifactResultsCount)

    const [artifact, setArtifact] = useState("");
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ArtifactTO[]>([]);
    const [displayResult, setDisplayResult] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
        if (open) {
            setOptions(searchedArtifacts);
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
        if (results === 0) {
            setLoading(false);
        }
    }, [searchedArtifacts, results]);

    const getRepoName = ((repoId: string) => {
        const assignedRepo = repos.find(repo => repo.id === repoId);
        return assignedRepo?.name;
    });

    const onChangeWithTimer = ((input: string) => {
        setArtifact(input);
        if (artifact === "") {
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
        setArtifact(event.target.textContent);
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
                        getOptionLabel={option => `${option.name}  (${getRepoName(option.repositoryId)})`}
                        onChange={updateState}
                        options={options}
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
                    <div className={classes.resultsContainer}>
                        {!loading && searchedArtifacts?.map(searchedArtifact => (
                            <a
                                className={classes.card}
                                key={searchedArtifact.id}
                                rel="noreferrer"
                                target="_blank"
                                href={`/modeler/#/${searchedArtifact.repositoryId}/${searchedArtifact.id}/latest/`}>
                                <ArtifactCard
                                    artifactRepo={getRepoName(searchedArtifact.repositoryId)}
                                    artifactTitle={searchedArtifact.name}
                                    image={searchedArtifact.svgPreview}
                                    fileType={searchedArtifact.fileType} />
                            </a>
                        ))}
                        {!loading && searchedArtifacts?.length === 0 && artifact.length > 0 && (
                            <span>{t("search.noResults")}</span>
                        )}
                    </div>
                </ErrorBoundary>
            </div>
        </>
    );
};

export default ArtifactSearchBar;
