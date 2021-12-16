import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { IconButton, ListItem, ListItemSecondaryAction } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import theme from "../../../theme";
import { ArtifactTO } from "../../../api";
import { RootState } from "../../../store/reducers/rootReducer";
import { ErrorBoundary } from "../../Exception/ErrorBoundary";
import { makeErrorToast } from "../../../util/toastUtils";

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
    addedArtifacts: ArtifactTO[];
}

const AddDeploymentSearchBar: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const activeArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.artifacts);

    const [artifact, setArtifact] = useState<ArtifactTO>();
    const [searchString, setSearchString] = useState<string>("");
    const [open, setOpen] = React.useState<boolean>(false);
    const [options, setOptions] = useState<Array<ArtifactTO>>(activeArtifacts);

    useEffect(() => {
        if (searchString === "") {
            setOpen(false);
        }
    }, [searchString]);

    const onChange = (input: string) => {
        setSearchString(input);
        if (input !== "") {
            const filtered = activeArtifacts.filter(activeArtifact => activeArtifact.name.toLowerCase().startsWith(input.toLowerCase()));
            setOptions(filtered);
            setOpen(true);
        }
        if (input === "") {
            setOptions(activeArtifacts);
            setOpen(false);
        }
    };

    // eslint-disable-next-line
    const updateState = (event: any, value: any) => {
        onChange(event.target.textContent || "");
        value && setArtifact(value);
        setSearchString(event.target.textContent || "");
    };

    const onAdd = () => {
        if (!artifact && !props.addedArtifacts.find(artifact => artifact.name.toLowerCase() === searchString.toLowerCase())) {
            const matchingArtifact = activeArtifacts.find(artifact => artifact.name.toLowerCase() === searchString.toLowerCase());
            matchingArtifact ? props.addArtifact(matchingArtifact) : makeErrorToast(t("artifact.notFound"), () => onAdd());
            matchingArtifact && setSearchString("");
            return;
        }

        props.addedArtifacts.find(artifact => artifact.name.toLowerCase() === searchString.toLowerCase()) ? console.log("artifact already added to list") : props.addArtifact(artifact);
        setArtifact(undefined);
        setSearchString("");
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
                            size="medium"
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
                <IconButton
                    className={classes.addButton}
                    edge="end"
                    onClick={() => {
                        onAdd();
                    }}>
                    <Add />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default AddDeploymentSearchBar;
