import {makeStyles} from "@material-ui/styles";
import theme from "../../../../theme";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {RepositoryTO, ShareWithRepositoryTORoleEnum, ShareWithTeamTORoleEnum, TeamTO} from "../../../../api";
import {IconButton, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Add} from "@material-ui/icons";
import {shareWithRepo} from "../../../../store/actions/shareAction";
import {SYNC_STATUS_SHARED} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";
import {useTranslation} from "react-i18next";
import {AxiosResponse} from "axios";

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
    artifactId: string;
    entity: "repository" | "team";
    searchMethod: (input: string) => Promise<AxiosResponse>;
    shareMethod: (artifactId: string, teamOrRepoId: string, role: any) => Promise<AxiosResponse>;
    roleForNewAssignments: ShareWithTeamTORoleEnum | ShareWithRepositoryTORoleEnum;
}

let timeout: NodeJS.Timeout | undefined;

const AddSharingSearchBar: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");




    const [elementName, setElementName] = useState("");
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<RepositoryTO[] | TeamTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [searchedElements, setSearchedElements] = useState<Array<RepositoryTO | TeamTO>>([]);


    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
        if (open) {
            setOptions(searchedElements);
        }
    }, [open, searchedElements]);

    useEffect(() => {
        if (searchedElements.length > 0) {
            setLoading(false);
        }
        if (searchedElements.length === 0) {
            setLoading(false);
        }
    }, [searchedElements]);

    useEffect(() => {
        if (elementName === "") {
            setLoading(false);
        }
    }, [elementName]);

    const onChangeWithTimer = ((input: string) => {
        setElementName(input);
        if (input !== "") {
            if (timeout) {
                clearTimeout(timeout);
            }
            setLoading(true);
            timeout = setTimeout(() => fetchSuggestion(input), 500);
        }
    });

    const fetchSuggestion = useCallback((input: string) => {
        props.searchMethod(input).then(response => {
            if(Math.floor(response.status / 100) === 2){
                setSearchedElements(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchSuggestion(input))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchSuggestion(input))
        })
    }, [props, t]);


    const getElementByName = useCallback((elementName: string) => {
        return searchedElements.find(element => element.name.toLowerCase() === elementName.toLowerCase());
    }, [searchedElements]);

    const add = useCallback(() => {
        try {
            const element = getElementByName(elementName);
            const elementId = element ? element.id : "";
            if (element) {
                props.shareMethod(props.artifactId, elementId, props.roleForNewAssignments).then(response => {
                    if(Math.floor(response.status / 100) === 2){
                        dispatch({type: SYNC_STATUS_SHARED, sharedSynced: false})
                        helpers.makeSuccessToast(t("share.successful"))
                    } else {
                        helpers.makeErrorToast(t(response.data.toString()), () => shareWithRepo(props.artifactId, elementId, ShareWithRepositoryTORoleEnum.Viewer))
                    }
                });
            }
        } catch (err) {
            console.log(err)
        }
    }, [dispatch, t, elementName, props, getElementByName]);

    // eslint-disable-next-line
    const updateState = (event: any) => {
        setElementName(event.target.textContent);
    };

    return (
        <ListItem className={classes.listItem} ContainerComponent="div">
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
                        label={t(`${props.entity}.add`)}
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
                <IconButton className={classes.addButton} edge="end" onClick={() => add()}>
                    <Add />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default AddSharingSearchBar;
