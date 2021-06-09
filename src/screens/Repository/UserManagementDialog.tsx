import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PopupDialog from "../../components/Form/PopupDialog";
import {getAllAssignedUsers} from "../../store/actions/assignmentAction";
import {UserInfoTO} from "../../api/models";
import {RootState} from "../../store/reducers/rootReducer";
import {List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Icon} from "@material-ui/core";
import {Settings} from "@material-ui/icons";

interface Props {
    open: boolean;
    onCancelled: () => void;
    repoId: string;
}

const UserManagementDialog: React.FC<Props> = props => {
    const dispatch = useDispatch()

    const { open, onCancelled } = props;

    const assignedUsers: Array<UserInfoTO> = useSelector((state: RootState) => state.assignedUsers.assignedUsers)

    const [error, setError] = useState<string | undefined>(undefined);

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


//#TODO: Display all users and an option to change their access rights (if the current user has the corresponding role)
    return (
        <PopupDialog
            open={open}
            title={"Users"}
            error={error}
            onCloseError={() => setError(undefined)}
            secondTitle="close"
            onSecond={onCancelled} >
            <List dense={false}>
                {assignedUsers?.map(user => (
                    <ListItem key={user.userName}>
                        <ListItemText
                            primary={user.userName}
                            secondary={user.email} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" >
                                <Settings/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}

            </List>

        </PopupDialog>
    );
};


export default UserManagementDialog;