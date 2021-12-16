import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { List, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { RootState } from "../../store/reducers/rootReducer";
import { AssignmentTO, AssignmentTORoleEnum, UserInfoTO } from "../../api";
import { SYNC_STATUS_ASSIGNMENT } from "../../constants/Constants";

import {
    createUserAssignment,
    deleteAssignment,
    fetchAssignedUsers,
    getMultipleUsers,
    updateUserAssignment
} from "../../store/actions";
import UserListItem from "../../components/Shared/UserListItem";
import AddUserSearchBar from "./AddUserSearchBar";
import { makeErrorToast } from "../../util/toastUtils";

const useStyles = makeStyles(() => ({
    list: {
        backgroundColor: "white"
    },

}));

interface Props {
    targetId: string;
}

const RepositoryMembers: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");
    const classes = useStyles();

    const syncStatus = useSelector((state: RootState) => state.dataSynced.assignmentSynced);
    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo);

    const [userAssignments, setUserAssignments] = useState<Array<AssignmentTO>>([]);
    const [users, setUsers] = useState<Array<UserInfoTO>>([]);

    const getAllAssignedUsers = useCallback(async (repoId: string) => {
        fetchAssignedUsers(props.targetId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setUserAssignments(response.data);
                const userIds: Array<string> = response.data.map(userAssignment => userAssignment.userId);

                userIds.length > 0 && getMultipleUsers(userIds).then(getMultipleUserResponse => {
                    if (Math.floor(getMultipleUserResponse.status / 100) === 2) {
                        // put the assigned users in the state
                        setUsers(getMultipleUserResponse.data);
                        dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: true });
                    } else {
                        makeErrorToast(t(getMultipleUserResponse.data.toString()), () => getAllAssignedUsers(repoId));
                    }
                });
            } else {
                makeErrorToast(t(response.data.toString()), () => getAllAssignedUsers(repoId));
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => getAllAssignedUsers(repoId));
        });
    }, [dispatch, props, t]);

    useEffect(() => {
        getAllAssignedUsers(props.targetId);
    }, [dispatch, getAllAssignedUsers, props.targetId]);

    useEffect(() => {
        if (!syncStatus) {
            getAllAssignedUsers(props.targetId);
        }
    }, [dispatch, getAllAssignedUsers, props.targetId, syncStatus]);

    const checkForAdminPermissions = useMemo(() => {
        const currentUserAssignment = userAssignments.find(assignmentTO => assignmentTO.userId === currentUser.id);
        try {
            if (currentUserAssignment?.role === AssignmentTORoleEnum.Admin || currentUserAssignment?.role === AssignmentTORoleEnum.Owner) {
                return true;
            }
            return false;
        } catch (err) {
            makeErrorToast(t("role.notFound"), () => console.log("could not retry"));
            return false;
        }
    }, [userAssignments, currentUser.id, t]);

    const getUserRole = (userId: string): AssignmentTORoleEnum => {
        const x = userAssignments.find(ass => ass.userId === userId);
        if (x) {
            return x.role;
        }
        return AssignmentTORoleEnum.Viewer;
    };

    return (
        <>
            <List dense={false}>
                {checkForAdminPermissions && (
                    <AddUserSearchBar
                        assignedUsers={users}
                        targetId={props.targetId}
                        createAssignmentMethod={createUserAssignment} />
                )}
                <Paper className={classes.list}>

                    {users?.map(user => (
                        <UserListItem
                            key={user.id}
                            assignmentTargetId={props.targetId}
                            assignmentTargetEntity="team"
                            userId={user.id}
                            username={user.username}
                            role={getUserRole(user.id)}
                            hasAdminPermissions={checkForAdminPermissions}
                            updateAssignmentMethod={updateUserAssignment}
                            deleteAssignmentMethod={deleteAssignment} />

                    ))}
                </Paper>

            </List>
        </>
    );
};

export default RepositoryMembers;
