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
import {AssignmentTO, RepoTeamAssignmentTO, TeamTO, UserInfoTO} from "../../api";
import helpers from "../../util/helperFunctions";
import {searchUsers} from "../../store/actions";
import {searchTeam} from "../../store/actions/teamAction";
import theme from "../../theme";

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

interface assignmentObject {
    id: string;
    name: string;
    type: "user" | "team";
}

interface Props {
    targetId: string;
    //TODO TeamAssignemntTO raus -> muss RepoTeamAssignemtn sein
    assignedUsers: Array<AssignmentTO>;
    assignedTeams: Array<RepoTeamAssignmentTO>;
    createTeamAssignmentMethod: (targetId: string, teamId: string, role: any) => Promise<AxiosResponse>;
    createUserAssignmentMethod: (targetId: string, userId: string, role: any) => Promise<AxiosResponse>;
}

let timeout: NodeJS.Timeout | undefined;

const AddUserOrTeamSearchBar: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [targetName, setTargetName] = useState("");
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchedUsers, setSearchedUsers] = useState<UserInfoTO[]>([]);
    const [searchedTeams, setSearchedTeams] = useState<TeamTO[]>([]);



    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
        if (open) {
            const resultsArray: Array<assignmentObject> = [];

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
        }
    }, [open, searchedTeams, searchedUsers]);

    useEffect(() => {
        if (searchedUsers.length + searchedTeams.length > 0) {
            setLoading(false);
        }
        if (searchedUsers.length + searchedTeams.length === 0) {
            setLoading(false);
        }
    }, [searchedTeams.length, searchedUsers]);

    useEffect(() => {
        if (targetName === "") {
            setLoading(false);
        }
    }, [targetName]);

    const onChangeWithTimer = ((input: string) => {
        setTargetName(input);
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

    //TODO Call createTeamAssignment if it's a team, createUserAssignment if its a user
    /*
    const isTeamAlreadyAssigned = useCallback((teamName: string): boolean => {
        return props.assignedTeams.find(team => team.name === teamName) !== undefined;
    }, [props.assignedTeams])
    */
    /*
 const isUserAlreadyAssigned = useCallback((userName: string): boolean => {

     return props.assignedUsers.find(user => user.username === userName) !== undefined

 }, [props.assignedUsers])



 const addUser = useCallback(() => {
     const target = getTargetByName(targetName);
     if (target?.type === "user") {
         if(isUserAlreadyAssigned(targetName)){
             helpers.makeErrorToast(t("assignment.alreadyPresent", {username: targetName}), () => addUser())
             return;
         }
         const role = props.entity === "team" ? TeamAssignmentTORoleEnum.Member : AssignmentTORoleEnum.Member
         props.createAssignmentMethod(props.targetId, target.id, target.name, role).then(response => {
             setTargetName("");
             if(Math.floor(response.status / 100) === 2){
                 dispatch({type: SYNC_STATUS_ASSIGNMENT, assignmentSynced: false})
                 helpers.makeSuccessToast(t("assignment.added", {username: targetName}))
             } else {
                 helpers.makeErrorToast(response.data.toString(), () => addUser())
             }
         }, error => {
             helpers.makeErrorToast(t(error.response.data), () => addUser)
         })
     }
 }, [getTargetByName, targetName, isUserAlreadyAssigned, props, t, dispatch]);


  */

    return (
        <ListItem className={classes.listItem} >
            <Autocomplete
                id="UserSearchBar"
                freeSolo
                open={open}
                fullWidth
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
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
                <IconButton className={classes.addButton} edge="end" onClick={() => console.log("tbd")}>
                    <Add />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default AddUserOrTeamSearchBar;
