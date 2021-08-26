import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/styles";
import theme from "../../../../theme";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {searchArtifact} from "../../../../store/actions";
import {ARTIFACTQUERY_EXECUTED, SEARCHED_ARTIFACTS} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";
import {ErrorBoundary} from "../../../../components/Exception/ErrorBoundary";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {IconButton, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import {ArtifactTO} from "../../../../api";
import {RootState} from "../../../../store/reducers/rootReducer";
import {Add} from "@material-ui/icons";


const useStyles = makeStyles(() => ({
    listItem: {
        paddingLeft: "0px",
        display: "flex",
        paddingRight: "60px"
    },
    addButton: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        borderRadius: "5px",
        height: "52px",
        width: "52px",
        transition: "background-color .3s, color .3s",
        "&:hover": {
            backgroundColor: theme.palette.secondary.contrastText,
            color: theme.palette.secondary.main
        }
    }
}));



interface Props {
    repoId: string;
    addArtifact: (artifact: ArtifactTO | undefined) => void;
}


const AddDeploymentSearchBar: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const searchedArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.searchedArtifacts);
    const foundDiagrams: number = useSelector((state: RootState) => state.resultsCount.artifactResultsCount);
    const activeArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.artifacts)

    const [artifact, setArtifact] = useState<ArtifactTO>();
    const [searchString, setSearchString] = useState<string>("");
    const [open, setOpen] = React.useState<boolean>(false);
    const [options, setOptions] = useState<Array<ArtifactTO>>(activeArtifacts);


    useEffect(() => {
        if (searchString === "") {
            setOpen(false)
        }
    }, [searchString]);

    const onChange = (input: string) => {
        setSearchString(input)
        if(input !== ""){
            const filtered = activeArtifacts.filter(activeArtifact => activeArtifact.name.toLowerCase().startsWith(input.toLowerCase()))
            setOptions(filtered)
            setOpen(true);
        }
        if(input === ""){
            setOptions(activeArtifacts)
            setOpen(false)
        }
    }

    const updateState = (event: any, value: any) => {
        onChange(event.target.textContent)
        value && setArtifact(value)
        console.log(value)
        setSearchString(event.target.textContent);
    };
    
    return (
        <ListItem className={classes.listItem}>
            <ErrorBoundary>
                <Autocomplete
                    size="small"
                    id="ArtifactSearchBar"
                    freeSolo
                    style={{ width: "100%" }}
                    open={open}
                    onOpen={() => {
                        setOpen(false);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={option => `${option.name}`}
                    onChange={updateState}
                    options={options}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={t("search.search")}
                            variant="outlined"
                            size={"medium"}
                            onChange={event => onChange(event.target.value)}
                            value={searchString}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }} />
                    )} />
            </ErrorBoundary>
            <ListItemSecondaryAction>
                <IconButton className={classes.addButton} edge="end" onClick={() => props.addArtifact(artifact)}>
                    <Add />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default AddDeploymentSearchBar;