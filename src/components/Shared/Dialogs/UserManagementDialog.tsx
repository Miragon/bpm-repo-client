import {List, Paper} from "@material-ui/core";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AddUserSearchBar from "./AddUserSearchBar";
import UserListItem from "./UserListItem";
import {useTranslation} from "react-i18next";
import {AxiosResponse} from "axios";
import {AssignmentTO, AssignmentTORoleEnum, TeamAssignmentTO} from "../../../api";
import helpers from "../../../util/helperFunctions";
import {SEARCHED_USERS, SYNC_STATUS_ASSIGNMENT} from "../../../constants/Constants";
import PopupDialog from "../Form/PopupDialog";
import {RootState} from "../../../store/reducers/rootReducer";

interface Props {
    entity: "repository" | "team";
    open: boolean;
    onCancelled: () => void;
    targetId: string;
    createAssignmentMethod: (targetId: string, userId: string, username: string, role: any) => Promise<AxiosResponse>;
    fetchAssignedUsersMethod: (targetId: string) => Promise<AxiosResponse>;
    updateAssignmentMethod: (targetId: string, userId: string, userName: string, role: any) => Promise<AxiosResponse>;
    deleteAssignmentMethod: (targetId: string, userName: string) => Promise<AxiosResponse>;
}

const UserManagementDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const syncStatus = useSelector((state: RootState) => state.dataSynced.assignmentSynced);
    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo);

    const [error, setError] = useState<string | undefined>(undefined);
    const [hasAdminPermissions, setHasAdminPermissions] = useState<boolean>(false);
    const [assignedUsers, setAssignedUsers] = useState<Array<AssignmentTO | TeamAssignmentTO>>([]);



    const getAllAssignedUsers = useCallback(async (repoId: string) => {
        props.fetchAssignedUsersMethod(props.targetId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                setAssignedUsers(response.data)
            } else{
                helpers.makeErrorToast(t(response.data.toString()), () => getAllAssignedUsers(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getAllAssignedUsers(repoId))
        })
    }, [props, t])


    useEffect(() => {
        if(!syncStatus){
            getAllAssignedUsers(props.targetId)
            dispatch({type: SYNC_STATUS_ASSIGNMENT, dataSynced: true });
        }
    }, [dispatch, getAllAssignedUsers, props.targetId, syncStatus]);

    const checkForAdminPermissions = useMemo(() => {
        const currentUserAssignment = assignedUsers.find(assignmentTO => assignmentTO.userId === currentUser.id);
        try {
            if (currentUserAssignment?.role === AssignmentTORoleEnum.Admin || currentUserAssignment?.role === AssignmentTORoleEnum.Owner) {
                setHasAdminPermissions(true);
                return true;
            }
            setHasAdminPermissions(false);
            return false;
        } catch (err) {
            helpers.makeErrorToast(t("role.notFound"), () => console.log("could not retry"))
            return false;
        }
    }, [assignedUsers, currentUser.id, t]);

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
                    <AddUserSearchBar
                        assignedUsers={assignedUsers}
                        targetId={props.targetId}
                        createAssignmentMethod={props.createAssignmentMethod}
                        entity={props.entity}/>
                )}
                <Paper>

                    {assignedUsers?.map(assignmentTO => (
                        <UserListItem
                            assignmentTO={assignmentTO}
                            hasAdminPermissions={hasAdminPermissions}
                            assignmentTargetId={props.targetId}
                            key={assignmentTO.userId}
                            deleteAssignmentMethod={props.deleteAssignmentMethod}
                            updateAssignmentMethod={props.updateAssignmentMethod}
                            assignmentUserId={assignmentTO.userId}
                            assignmentUserName={assignmentTO.username}/>

                    ))}
                </Paper>

            </List>
        </PopupDialog>
    );
};

export default UserManagementDialog;
