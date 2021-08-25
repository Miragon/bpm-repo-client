import {makeStyles} from "@material-ui/styles";
import theme from "../../../../theme";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RepositoryTO, ShareWithRepositoryTORoleEnum} from "../../../../api";
import {RootState} from "../../../../store/reducers/rootReducer";
import {IconButton, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Add} from "@material-ui/icons";
import {shareWithRepo} from "../../../../store/actions/ShareAction";
import {searchRepos} from "../../../../store/actions";
import {SEARCHED_REPOS} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";
import {useTranslation} from "react-i18next";

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
    currentRepoId: string;
    artifactId: string;
}

let timeout: NodeJS.Timeout | undefined;

const AddSharingSearchBar: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const searchedRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.searchedRepos
    );

    const [repositoryName, setRepositoryName] = useState("");
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<RepositoryTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
        if (open) {
            setOptions(searchedRepos);
        }
    }, [open, searchedRepos]);

    useEffect(() => {
        if (searchedRepos.length > 0) {
            setLoading(false);
        }
        if (searchedRepos.length === 0) {
            setLoading(false);
        }
    }, [searchedRepos]);

    useEffect(() => {
        if (repositoryName === "") {
            setLoading(false);
        }
    }, [repositoryName]);

    const onChangeWithTimer = ((input: string) => {
        setRepositoryName(input);
        if (input !== "") {
            if (timeout) {
                clearTimeout(timeout);
            }
            setLoading(true);
            timeout = setTimeout(() => fetchRepositorySuggestion(input), 500);
        }
    });

    const fetchRepositorySuggestion = useCallback((input: string) => {
        searchRepos(input).then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({type: SEARCHED_REPOS, searchedRepos: response.data});
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchRepositorySuggestion(input))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchRepositorySuggestion(input))
        })
    }, [dispatch, t]);


    const getRepoByName = useCallback((repositoryName: string) => {
        return searchedRepos.find(repo => repo.name.toLowerCase() === repositoryName.toLowerCase());
    }, [searchedRepos]);

    const addRepository = useCallback(() => {
        try {
            const repository = getRepoByName(repositoryName);
            const repositoryId = repository ? repository.id : "";
            if (repository) {
                dispatch(shareWithRepo(props.artifactId, repositoryId, ShareWithRepositoryTORoleEnum.Viewer));
                setRepositoryName("");
            }
        } catch (err) {
            console.log(err);
        }
    }, [dispatch, repositoryName, props, getRepoByName]);

    const updateState = (event: any) => {
        setRepositoryName(event.target.textContent);
    };

    return (
        <ListItem className={classes.listItem}>
            <Autocomplete
                id="UserSearchBar"
                freeSolo
                style={{ width: 500 }}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={option => option.name}
                options={options}
                onChange={updateState}
                loading={loading}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Add Repository"
                        variant="outlined"
                        onChange={event => onChangeWithTimer(event.target.value)}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }} />
                )} />
            <ListItemSecondaryAction>
                <IconButton className={classes.addButton} edge="end" onClick={() => addRepository()}>
                    <Add />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default AddSharingSearchBar;
