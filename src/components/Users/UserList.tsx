import { Typography } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import UserListEntry, { UserInfo } from "./UserListEntry";

interface Props {
    users: UserInfo[];
    fallback: string;
    className?: string;
    onEditClicked: (user: UserInfo) => void;
    onDeleteClicked: (user: UserInfo) => void;
}

const UserList: React.FC<Props> = (props: Props) => {
    const { t } = useTranslation("common");

    const {
        fallback,
        className,
        onEditClicked,
        users,
        onDeleteClicked
    } = props;

    return (
        <div className={className}>
            {users.length === 0 && (
                <Typography variant="body1">
                    {t(fallback)}
                </Typography>
            )}
            {users.map(user => (
                <UserListEntry
                    key={user.id}
                    user={user}
                    onEditClicked={() => onEditClicked(user)}
                    onDeleteClicked={() => onDeleteClicked(user)} />
            ))}
        </div>
    );
};

export default UserList;
