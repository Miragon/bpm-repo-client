import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PopupDialog from "../../components/Form/PopupDialog";
import {getAllAssignedUsers} from "../../store/actions/assignmentAction";
import {BpmnRepositoryRequestTO, UserInfoTO} from "../../api/models";
import {RootState} from "../../store/reducers/rootReducer";
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Icon,
    Paper,
    InputBase, TextField
} from "@material-ui/core";
import {Settings, Add} from "@material-ui/icons";
import {AssignmentTO} from "../../api/models/assignment-to";
import UserListItem from "./UserListItem";
import SettingsTextField from "../../components/Form/SettingsTextField";
import {makeStyles} from "@material-ui/core/styles";
import * as assignmentAction from "../../store/actions/assignmentAction";
import {SYNC_STATUS} from "../../store/actions/diagramAction";

interface Props {
    open: boolean;
    onCancelled: () => void;
    repoId: string;
}

const useStyles = makeStyles(() => ({
    textField: {
        left: "0px",
        width: "80%"
    },
    button: {

        right: "0px",
        width: "80%"
    }
}));


const UserManagementDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch()

    const { open, onCancelled } = props;

    const assignmentTOs: Array<AssignmentTO> = useSelector((state: RootState) => state.assignedUsers.assignedUsers)
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.dataSynced)

    const [error, setError] = useState<string | undefined>(undefined);
    const [user, setUser] = useState<string>("");


    const fetchAssignedUsers = useCallback((repoId: string) => {
        try {
            dispatch(getAllAssignedUsers(repoId))
        } catch (err) {
            console.log(err)
        }
    }, [dispatch])

    useEffect(() => {
        fetchAssignedUsers(props.repoId)
        if(!syncStatus){
            fetchAssignedUsers(props.repoId)
        }
    }, [fetchAssignedUsers, syncStatus])

    const addUser = useCallback(() => {
        try {
            console.log("Added user")
            dispatch(assignmentAction.createOrUpdateUserAssignment(props.repoId, user))
        } catch (err) {
            console.log(err)
        }

    }, [dispatch, user])


//#TODO: Autosuggestions? Load all usernames on Input? Load Users after  x letters entered? ...
    //#TODO: Style the Input field
    return (
        <PopupDialog
            open={open}
            title={"Users"}
            error={error}
            onCloseError={() => setError(undefined)}
            secondTitle="close"
            onSecond={onCancelled} >
            <List dense={false}>
                <ListItem>
                    <SettingsTextField label="Add user"
                                       value={user}
                                       onChanged={setUser}

                    />

                    <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => addUser()}>
                            <Add/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                <Paper>

                {assignmentTOs?.map(assignmentTO => (
                    <UserListItem assignmentTO={assignmentTO} key={assignmentTO.userId} />
                ))}
                </Paper>

            </List>
        </PopupDialog>
    );
};


export default UserManagementDialog;