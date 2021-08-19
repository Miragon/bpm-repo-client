import {List, Paper} from "@material-ui/core";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AddUserSearchBar from "./AddUserSearchBar";
import UserListItem from "./UserListItem";
import {useTranslation} from "react-i18next";
import {RootState} from "../../../../store/reducers/rootReducer";
import {AssignmentTO, AssignmentTORoleEnum} from "../../../../api";
import {getAllAssignedUsers} from "../../../../store/actions";
import {HANDLEDERROR, SEARCHED_USERS} from "../../../../constants/Constants";
import PopupDialog from "../../../../components/Form/PopupDialog";

interface Props {
    open: boolean;
    onCancelled: () => void;
    repoId: string;
}

const UserManagementDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const { open, onCancelled, repoId } = props;

    const assignmentTOs: Array<AssignmentTO> = useSelector(
        (state: RootState) => state.user.assignedUsers
    );
    const syncStatus = useSelector((state: RootState) => state.dataSynced.assignmentSynced);
    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo);

    const [error, setError] = useState<string | undefined>(undefined);
    const [hasAdminPermissions, setHasAdminPermissions] = useState<boolean>(false);

    const fetchAssignedUsers = useCallback((repoId: string) => {
        try {
            dispatch(getAllAssignedUsers(repoId));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch]);

    useEffect(() => {
        if(open && !syncStatus){
            fetchAssignedUsers(repoId);
        }
    }, [fetchAssignedUsers, syncStatus, repoId, open]);

    const checkForAdminPermissions = useMemo(() => {
        const currentUserAssignment = assignmentTOs
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
    }, [assignmentTOs, currentUser, dispatch]);

    const onCancel = (() => {
        dispatch({ type: SEARCHED_USERS, searchedUsers: [] });
        onCancelled();
    });

    // #TODO: Style the Input field
    return (
        <PopupDialog
            open={open}
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

                    {assignmentTOs?.map(assignmentTO => (
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
