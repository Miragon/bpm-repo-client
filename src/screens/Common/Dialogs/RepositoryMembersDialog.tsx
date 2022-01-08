import { makeStyles } from "@material-ui/core/styles";
import { PeopleAltOutlined } from "@material-ui/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AssignmentTO, RepoAssignmentApi, RepositoryTO, UserApi, UserInfoTO } from "../../../api";
import UserList from "../../../components/Users/UserList";
import { UserInfo } from "../../../components/Users/UserListEntry";
import PopupDialog from "../../../components/Form/PopupDialog";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import RepositoryAddMemberDialog from "./RepositoryAddMemberDialog";
import RepositoryEditMemberDialog from "./RepositoryEditMemberDialog";
import RepositoryRemoveMemberDialog from "./RepositoryRemoveMemberDialog";

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
});

interface Props {
    open: boolean;
    repository: RepositoryTO | undefined;
    onClose: () => void;
}

const RepositoryMembersDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { repository, open, onClose } = props;

    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const [editUser, setEditUser] = useState<UserInfo>();
    const [removeUser, setRemoveUser] = useState<UserInfo>();
    const [error, setError] = useState<string>();
    const [assignments, setAssignments] = useState<AssignmentTO[]>();
    const [users, setUsers] = useState<UserInfoTO[]>();

    const userInfo: UserInfo[] = useMemo(() => {
        return assignments?.map(assignment => ({
            id: assignment.userId,
            role: assignment.role,
            name: users?.find(user => user.id === assignment.userId)?.username || "Unknown"
        })) || [];
    }, [assignments, users]);

    const load = useCallback(async () => {
        if (!repository) {
            return;
        }

        const assignmentsResponse = await apiExec(RepoAssignmentApi, api => api.getAllAssignedUsers(repository.id));
        if (hasFailed(assignmentsResponse)) {
            setError(t(assignmentsResponse.error));
            return;
        }

        const usersResponse = await apiExec(UserApi, api => api.getMultipleUsers(assignmentsResponse.result.map(a => a.userId)));
        if (hasFailed(usersResponse)) {
            setError(t(usersResponse.error));
            return;
        }

        setAssignments(assignmentsResponse.result);
        setUsers(usersResponse.result);
    }, [repository, t]);

    useEffect(() => {
        if (repository) {
            load();
        }
    }, [load, repository]);

    const onCancel = () => {
        setAssignments(undefined);
        setUsers(undefined);
        onClose();
    };

    return (
        <PopupDialog
            full
            error={error}
            icon={<PeopleAltOutlined className={classes.icon} />}
            onClose={onCancel}
            onCloseError={load}
            open={open}
            firstTitle="Benutzer hinzufügen"
            onFirst={() => setAddMemberDialogOpen(true)}
            title={t("repository.editUsers")}>

            <UserList
                users={userInfo}
                fallback=""
                onEditClicked={setEditUser}
                onDeleteClicked={setRemoveUser} />

            <RepositoryRemoveMemberDialog
                open={!!removeUser}
                onClose={removed => {
                    setRemoveUser(undefined);
                    removed && load();
                }}
                user={removeUser}
                repository={repository} />

            <RepositoryEditMemberDialog
                open={!!editUser}
                onClose={edited => {
                    setEditUser(undefined);
                    edited && load();
                }}
                user={editUser}
                repository={repository} />

            <RepositoryAddMemberDialog
                open={addMemberDialogOpen}
                onClose={added => {
                    setAddMemberDialogOpen(false);
                    added && load();
                }}
                repository={repository} />

        </PopupDialog>
    );
};

export default RepositoryMembersDialog;
