import React, {useCallback, useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDispatch, useSelector} from "react-redux";
import {IconButton, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import * as userAction from "../../../store/actions/userAction";
import {UserInfoTO} from "../../../api/models";
import {RootState} from "../../../store/reducers/rootReducer";
import * as assignmentAction from "../../../store/actions/assignmentAction";
import theme from "../../../theme";

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

    const searchedUsers: Array<UserInfoTO> = useSelector(
        (state: RootState) => state.user.searchedUsers
    );
    const results: number = useSelector((state: RootState) => state.resultsCount.userResultsCount);

    const [userName, setUserName] = useState("");
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
        if (userName === "") {
            setLoading(false);
        }
    }, [userName]);

    const onChangeWithTimer = ((input: string) => {
        setUserName(input);
        if (input !== "") {
            if (timeout) {
                clearTimeout(timeout);
            }
            setLoading(true);
            timeout = setTimeout(() => fetchUserSuggestions(input), 500);
        }
    });

    const fetchUserSuggestions = useCallback((input: string) => {
        dispatch(userAction.searchUsers(input));
    }, [dispatch]);

    // #TODO: Add the UserId prop to AssignmentUpdate in Backend

    const getUserByName = useCallback((username: string) => {
        return searchedUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
    }, [searchedUsers]);

    const addUser = useCallback(() => {
        try {
            const user = getUserByName(userName);
            if (user) {
                dispatch(assignmentAction
                    .createOrUpdateUserAssignment(props.repoId, user?.id, user?.username));
                setUserName("");
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch, userName, props, getUserByName]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateState = (event: any) => {
        setUserName(event.target.textContent);
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
