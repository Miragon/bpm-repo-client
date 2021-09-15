import React, {useCallback, useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDispatch, useSelector} from "react-redux";
import {IconButton, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import {AssignmentTO, AssignmentUpdateTORoleEnum, UserInfoTO} from "../../../../api";
import {RootState} from "../../../../store/reducers/rootReducer";
import {createUserAssignment, searchUsers} from "../../../../store/actions";
import theme from "../../../../theme";
import {SEARCHED_USERS, SYNC_STATUS_ASSIGNMENT, USERQUERY_EXECUTED} from "../../../../constants/Constants";
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
    repoId: string;
}

let timeout: NodeJS.Timeout | undefined;

const AddUserSearchBar: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const searchedUsers: Array<UserInfoTO> = useSelector((state: RootState) => state.user.searchedUsers);
    const assignedUsers: Array<AssignmentTO> = useSelector((state: RootState) => state.user.assignedUsers);

    const results: number = useSelector((state: RootState) => state.resultsCount.userResultsCount);

    const [username, setUsername] = useState("");
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<UserInfoTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
        if (open) {
            setOptions(searchedUsers);
        }
    }, [open, searchedUsers]);

    useEffect(() => {
        if (searchedUsers.length > 0) {
            setLoading(false);
        }
        if (results === 0) {
            setLoading(false);
        }
    }, [searchedUsers, results]);

    useEffect(() => {
        if (username === "") {
            setLoading(false);
        }
    }, [username]);

    const onChangeWithTimer = ((input: string) => {
        setUsername(input);
        if (input !== "") {
            if (timeout) {
                clearTimeout(timeout);
            }
            setLoading(true);
            timeout = setTimeout(() => fetchUserSuggestions(input), 500);
        }
    });

    const fetchUserSuggestions = useCallback((input: string) => {
        searchUsers(input).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                dispatch({type: SEARCHED_USERS, searchedUsers: response.data});
                dispatch({type: USERQUERY_EXECUTED, userResultsCount: response.data.length});
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchUserSuggestions(input))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchUserSuggestions(input))

        })
    }, [dispatch, t]);


    const getUserByName = useCallback((username: string) => {
        return searchedUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
    }, [searchedUsers]);

    const isUserAlreadyAssigned = useCallback((username: string): boolean => {
        return assignedUsers.find(user => user.username === username) !== undefined;
    }, [assignedUsers])

    const addUser = useCallback(() => {
        const user = getUserByName(username);
        if (user) {
            if(isUserAlreadyAssigned(username)){
                helpers.makeSuccessToast(t("assignment.alreadyPresent", {username}))
                return;
            }
            createUserAssignment(props.repoId, user.id, username, AssignmentUpdateTORoleEnum.Member).then(response => {
                setUsername("");
                if(Math.floor(response.status / 100) === 2){
                    dispatch({type: SYNC_STATUS_ASSIGNMENT, assignmentSynced: false})
                    helpers.makeSuccessToast(t("assignment.added", {username}))
                } else {
                    helpers.makeErrorToast(response.data.toString(), () => addUser())
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => addUser)
            })
        }
    }, [getUserByName, username, isUserAlreadyAssigned, props.repoId, dispatch, t]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateState = (event: any) => {
        setUsername(event.target.textContent);
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
                getOptionSelected={(option, value) => option.username === value.username}
                getOptionLabel={option => option.username}
                options={options}
                onChange={updateState}
                loading={loading}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Add user"
                        size={"medium"}
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
                <IconButton className={classes.addButton} edge="end" onClick={() => addUser()}>
                    <Add />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default AddUserSearchBar;
