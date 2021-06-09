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
    const activeRepo: BpmnRepositoryRequestTO = useSelector((state: RootState) => state.activeRepo.activeRepo)

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
    }, [fetchAssignedUsers])

    const addUser = useCallback(() => {
        try {
            console.log("Added user")
            dispatch(assignmentAction.createOrUpdateUserAssignment(activeRepo.bpmnRepositoryId, user))
        } catch (err) {
            console.log(err)
        }

    }, [dispatch, user, activeRepo])


//#TODO: Update the List when a user has been added/ the role has been changed
    //#TODO: Style the Input field
    //#TODO: Call the CreateOrUpdateAssignment Method when clicking on Member/Admin/...
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
                {assignmentTOs?.map(assignmentTO => (
                    <UserListItem assignmentTO={assignmentTO} key={assignmentTO.userId} />
                ))}

            </List>

        </PopupDialog>
    );
};


export default UserManagementDialog;