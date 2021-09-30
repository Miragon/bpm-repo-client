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
import {AssignmentTO, AssignmentTORoleEnum, TeamAssignmentTORoleEnum, TeamTO, User, UserInfoTO} from "../../api";
import theme from "../../theme";
import helpers from "../../util/helperFunctions";
import {searchTeam} from "../../store/actions/teamAction";
import {searchUsers} from "../../store/actions";
import {SYNC_STATUS_ASSIGNMENT} from "../../constants/Constants";


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
    assignedUsers: Array<UserInfoTO>;
    createAssignmentMethod: (targetId: string, userId: string, role: any) => Promise<AxiosResponse<any>>;
}

interface assignmentObject {
    id: string;
    name: string;
    type: "user" | "team";
}

let timeout: NodeJS.Timeout | undefined;

const AddUserSearchBar: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [username, setUsername] = useState("");
    const [options, setOptions] = React.useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchedUsers, setSearchedUsers] = useState<UserInfoTO[]>([]);
    const [searchedTeams, setSearchedTeams] = useState<TeamTO[]>([]);

    useEffect(() => {
        console.log(options)
    }, [options])

    useEffect(() => {
        const resultsArray: Array<any> = [];

        searchedUsers.map(user => {
            const o: assignmentObject = {id: user.id,
                name: user.username,
                type: "user"}
            resultsArray.push(o)});

        searchedTeams.map(team => {
            const o: assignmentObject = {
                id: team.id,
                name: team.name,
                type: "team"
            }
            resultsArray.push(o)
        })
        setOptions(resultsArray);
    }, [searchedTeams, searchedUsers]);

    useEffect(() => {
        if (searchedUsers.length + searchedTeams.length > 0) {
            setLoading(false);
        }
        if (searchedUsers.length + searchedTeams.length === 0) {
            setLoading(false);
        }
    }, [searchedTeams.length, searchedUsers]);

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
            timeout = setTimeout(() => fetchUserAndTeamSuggestion(input), 500);
        }
    });

    const fetchUserAndTeamSuggestion = useCallback((input: string) => {
        searchUsers(input).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                setSearchedUsers(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchUserAndTeamSuggestion(input))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchUserAndTeamSuggestion(input))
        })

        searchTeam(input).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                setSearchedTeams(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchUserAndTeamSuggestion(input))
                setLoading(false)
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchUserAndTeamSuggestion(input))
        })
    }, [t]);


    const getObjectByName = useCallback((targetName: string) => {
        return options.find(option => option.name.toLowerCase() === targetName.toLowerCase());
    }, [options]);


    const isUserAlreadyAssigned = useCallback((userName: string): boolean => {

        return props.assignedUsers.find(user => user.username === userName) !== undefined

    }, [props.assignedUsers])

    const addUser = () => {
        console.log("Adding")
        console.log(options)
        const object = getObjectByName(username);
        console.log(object)
        if (object?.type === "user") {
            if(isUserAlreadyAssigned(username)){
                helpers.makeErrorToast(t("assignment.alreadyPresent", username), () => addUser())
                return;
            }
            const role = AssignmentTORoleEnum.Member
            props.createAssignmentMethod(props.targetId, object.id, role).then(response => {
                setUsername("");
                if(Math.floor(response.status / 100) === 2){
                    dispatch({type: SYNC_STATUS_ASSIGNMENT, assignmentSynced: false})
                    helpers.makeSuccessToast(t("assignment.added", username))
                } else {
                    helpers.makeErrorToast(response.data.toString(), () => addUser())
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => addUser)
            })
        }
    }


    return (
        <ListItem className={classes.listItem} >
            <Autocomplete
                id="UserSearchBar"
                freeSolo
                fullWidth
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={option => option.name}
                options={options}
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
