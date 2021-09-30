import {AxiosResponse} from "axios";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {RootState} from "../../store/reducers/rootReducer";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import helpers from "../../util/helperFunctions";
import {TeamAssignmentTO, TeamAssignmentTORoleEnum, UserInfoTO} from "../../api";
import {SYNC_STATUS_ASSIGNMENT} from "../../constants/Constants";
import {List, Paper} from "@material-ui/core";
import {
    createUserTeamAssignment,
    deleteUserTeamAssignment,
    fetchTeamAssignedUsers,
    updateUserTeamAssignment
} from "../../store/actions/teamAssignmentAction";
import {getMultipleUsers} from "../../store/actions";
import AddUserSearchBar from "./AddUserSearchBar";
import UserListItem from "../../components/Shared/UserListItem";


interface Props {
    targetId: string
}

const TeamMembers: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const syncStatus = useSelector((state: RootState) => state.dataSynced.assignmentSynced);
    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo);

    const [userAssignments, setUserAssignments] = useState<Array<TeamAssignmentTO>>([]);
    const [users, setUsers] = useState<Array<UserInfoTO>>([]);


    const getAllAssignedUsers = useCallback(async (repoId: string) => {
        //1: Get all assignments
        fetchTeamAssignedUsers(props.targetId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                //2: Keep the userIds from the assignments
                setUserAssignments(response.data)
                const userIds: Array<string> = response.data.map(userAssignment => userAssignment.userId)
                //3: Take the userIds and request the user objects
                getMultipleUsers(userIds).then(response => {
                    if(Math.floor(response.status / 100) === 2){
                        //put the assigned users in the state
                        setUsers(response.data)
                        dispatch({type: SYNC_STATUS_ASSIGNMENT, dataSynced: true });
                    } else{
                        helpers.makeErrorToast(t(response.data.toString()), () => getAllAssignedUsers(repoId))
                    }
                })
            } else{
                helpers.makeErrorToast(t(response.data.toString()), () => getAllAssignedUsers(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getAllAssignedUsers(repoId))
        })
    }, [dispatch, props, t])

    useEffect(() => {
        getAllAssignedUsers(props.targetId)
    }, [dispatch, getAllAssignedUsers, props.targetId]);

    useEffect(() => {
        if(!syncStatus){
            getAllAssignedUsers(props.targetId)
        }
    }, [dispatch, getAllAssignedUsers, props.targetId, syncStatus]);

    const checkForAdminPermissions = useMemo(() => {
        const currentUserAssignment = userAssignments.find(assignmentTO => assignmentTO.userId === currentUser.id);
        try {
            if (currentUserAssignment?.role === TeamAssignmentTORoleEnum.Admin || currentUserAssignment?.role === TeamAssignmentTORoleEnum.Owner) {
                return true;
            }
            return false;
        } catch (err) {
            helpers.makeErrorToast(t("role.notFound"), () => console.log("could not retry"))
            return false;
        }
    }, [userAssignments, currentUser.id, t]);

    const getUserRole = (userId: string): TeamAssignmentTORoleEnum => {
        const x =  userAssignments.find(ass => ass.userId === userId)
        if(x){
            return x.role
        } else {
            return TeamAssignmentTORoleEnum.Viewer
        }
    }

    return (
        <>
            <List dense={false}>
                {checkForAdminPermissions && (
                    <AddUserSearchBar
                        assignedUsers={users}
                        targetId={props.targetId}
                        createAssignmentMethod={createUserTeamAssignment}/>
                )}
                <Paper>

                    {users?.map(user => (
                        <UserListItem
                            assignmentTargetId={props.targetId}
                            assignmentTargetEntity={"team"}
                            userId={user.id}
                            username={user.username}
                            role={getUserRole(user.id)}
                            hasAdminPermissions={checkForAdminPermissions}
                            updateAssignmentMethod={updateUserTeamAssignment}
                            deleteAssignmentMethod={deleteUserTeamAssignment} />
                    ))}
                </Paper>

            </List>
        </>
    )
}

export default TeamMembers;