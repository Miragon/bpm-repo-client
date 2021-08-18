import React, {useCallback, useRef, useState} from "react";
import {Divider, IconButton, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {Settings} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {AssignmentTO, AssignmentUpdateTORoleEnumEnum} from "../../../../api";
import {DropdownButtonItem} from "../../../../components/Form/DropdownButton";
import PopupSettings from "../../../../components/Form/PopupSettings";
import {createOrUpdateUserAssignment, deleteAssignment} from "../../../../store/actions";

interface Props {
    assignmentTO: AssignmentTO;
    hasAdminPermissions: boolean;
}


const UserListItem: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);

    const changeRole = useCallback((role: AssignmentUpdateTORoleEnumEnum) => {
        try {
            dispatch(createOrUpdateUserAssignment(
                props.assignmentTO.repositoryId,
                props.assignmentTO.userId,
                props.assignmentTO.username,
                role
            ));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch, props]);

    const removeUser = useCallback(() => {
        try {
            dispatch(deleteAssignment(
                props.assignmentTO.repositoryId,
                props.assignmentTO.username
            ));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch, props]);

    const options: DropdownButtonItem[] = [
        {
            id: "Owner",
            label: t("user.OWNER"),
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnumEnum.Owner);
            }
        },
        {
            id: "Admin",
            label: t("user.ADMIN"),
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnumEnum.Admin);
            }
        },
        {
            id: "Member",
            label: t("user.MEMBER"),
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnumEnum.Member);
            }
        },
        {
            id: "Viewer",
            label: t("user.VIEWER"),
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnumEnum.Viewer);
            }
        },
        {
            id: "divider1",
            type: "divider",
            label: "",
            onClick: () => { /* Do nothing */
            }
        },
        {
            id: "Remove",
            label: t("user.remove"),
            type: "button",
            onClick: () => {
                removeUser();
            }
        }
    ];

    return (
        <>
            <ListItem>
                <ListItemText
                    primary={props.assignmentTO.username}
                    secondary={t(`user.${props.assignmentTO.roleEnum}`)} />
                {props.hasAdminPermissions && (
                    <ListItemSecondaryAction>
                        <IconButton ref={ref} edge="end" onClick={() => setOpen(true)}>
                            <Settings />
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
            <Divider />
            <PopupSettings
                open={open}
                reference={ref.current}
                onCancel={() => setOpen(false)}
                options={options} />
        </>
    );
};

export default UserListItem;
