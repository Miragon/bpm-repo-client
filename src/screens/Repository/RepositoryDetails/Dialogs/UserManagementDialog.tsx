import {List, Paper} from "@material-ui/core";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AddUserSearchBar from "./AddUserSearchBar";
import UserListItem from "./UserListItem";
import {useTranslation} from "react-i18next";
import {RootState} from "../../../../store/reducers/rootReducer";
import {AssignmentTO, AssignmentTORoleEnum} from "../../../../api";
import {fetchAssignedUsers} from "../../../../store/actions";
import {ASSIGNED_USERS, HANDLEDERROR, SEARCHED_USERS, SYNC_STATUS_ASSIGNMENT} from "../../../../constants/Constants";
import PopupDialog from "../../../../components/Form/PopupDialog";
import helpers from "../../../../util/helperFunctions";

interface Props {
    open: boolean;
    onCancelled: () => void;
    repoId: string;
}

const UserManagementDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const syncStatus = useSelector((state: RootState) => state.dataSynced.assignmentSynced);
    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo);
    const assignedUsers: Array<AssignmentTO> = useSelector((state: RootState) => state.user.assignedUsers);

    const [error, setError] = useState<string | undefined>(undefined);
    const [hasAdminPermissions, setHasAdminPermissions] = useState<boolean>(false);


    const getAll = useCallback(async (repoId: string) => {
        fetchAssignedUsers(repoId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({type: ASSIGNED_USERS, assignedUsers: response.data})
                dispatch({type: SYNC_STATUS_ASSIGNMENT, dataSynced: true });
            } else{
                helpers.makeErrorToast(t(response.data.toString()), () => getAll(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getAll(repoId))
        })
    }, [dispatch, t])



    useEffect(() => {
        if(!syncStatus){
            getAll(props.repoId)
        }
    }, [getAll, props.repoId, syncStatus]);

    const checkForAdminPermissions = useMemo(() => {
        const currentUserAssignment = assignedUsers
            .find(assignmentTO => assignmentTO.username === currentUser.username);
        try {
            if (currentUserAssignment?.role === AssignmentTORoleEnum.Admin
                || currentUserAssignment?.role === AssignmentTORoleEnum.Owner) {
                setHasAdminPermissions(true);
                return true;
            }
            setHasAdminPermissions(false);
            return false;
        } catch (err) {
            dispatch({
                type: HANDLEDERROR,
                message: "Error while checking permissions for this repository"
            });
            return false;
        }
    }, [assignedUsers, currentUser, dispatch]);

    const onCancel = (() => {
        dispatch({ type: SEARCHED_USERS, searchedUsers: [] });
        props.onCancelled();
    });

    return (
        <PopupDialog
            open={props.open}
            title={t("user.users")}
            error={error}
            onCloseError={() => setError(undefined)}
            secondTitle={t("dialog.close")}
            onSecond={onCancel}>
            <List dense={false}>
                {checkForAdminPermissions && (
                    <AddUserSearchBar repoId={props.repoId} />
                )}
                <Paper>

                    {assignedUsers?.map(assignmentTO => (
                        <UserListItem
                            assignmentTO={assignmentTO}
                            hasAdminPermissions={hasAdminPermissions}
                            key={assignmentTO.userId} />

                    ))}
                </Paper>

            </List>
        </PopupDialog>
    );
};

export default UserManagementDialog;
