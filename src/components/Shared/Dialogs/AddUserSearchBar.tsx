import React, {useCallback, useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDispatch} from "react-redux";
import {IconButton, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import {useTranslation} from "react-i18next";
import {AxiosResponse} from "axios";
import {AssignmentTO, AssignmentTORoleEnum, TeamAssignmentTO, TeamAssignmentTORoleEnum, UserInfoTO} from "../../../api";
import theme from "../../../theme";
import helpers from "../../../util/helperFunctions";
import {searchUsers} from "../../../store/actions";
import {SYNC_STATUS_ASSIGNMENT} from "../../../constants/Constants";

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
    targetId: string;
    assignedUsers: Array<AssignmentTO | TeamAssignmentTO>;
    entity: "repository" |"team",
    createAssignmentMethod: (targetId: string, userId: string, username: string, role: any) => Promise<AxiosResponse>;
}

let timeout: NodeJS.Timeout | undefined;

const AddUserSearchBar: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [username, setUsername] = useState("");
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<UserInfoTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchedUsers, setSearchedUsers] = useState<UserInfoTO[]>([]);
    const [numberReturnedUsers, setNumberReturnedUsers] = useState<number>();

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
        if (numberReturnedUsers === 0) {
            setLoading(false);
        }
    }, [numberReturnedUsers, searchedUsers]);

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
                setSearchedUsers(response.data)
                setNumberReturnedUsers(response.data.length)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchUserSuggestions(input))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchUserSuggestions(input))
        })
    }, [t]);


    const getUserByName = useCallback((username: string) => {
        return searchedUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
    }, [searchedUsers]);

    const isUserAlreadyAssigned = useCallback((username: string): boolean => {
        return props.assignedUsers.find(user => user.username === username) !== undefined;
    }, [props.assignedUsers])

    const addUser = useCallback(() => {
        const user = getUserByName(username);
        if (user) {
            if(isUserAlreadyAssigned(username)){
                helpers.makeErrorToast(t("assignment.alreadyPresent", {username}), () => addUser())
                return;
            }
            const role = props.entity === "team" ? TeamAssignmentTORoleEnum.Member : AssignmentTORoleEnum.Member
            props.createAssignmentMethod(props.targetId, user.id, username, role).then(response => {
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
    }, [getUserByName, username, isUserAlreadyAssigned, props, t, dispatch]);

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
