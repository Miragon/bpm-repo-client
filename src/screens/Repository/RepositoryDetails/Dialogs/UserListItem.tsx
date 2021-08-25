import React, {useCallback, useRef, useState} from "react";
import {Divider, IconButton, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {Settings} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {AssignmentTO, AssignmentUpdateTORoleEnum} from "../../../../api";
import {DropdownButtonItem} from "../../../../components/Form/DropdownButton";
import PopupSettings from "../../../../components/Form/PopupSettings";
import {deleteAssignment, updateUserAssignment} from "../../../../store/actions";
import {SYNC_STATUS_ASSIGNMENT} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";

interface Props {
    assignmentTO: AssignmentTO;
    hasAdminPermissions: boolean;
}


const UserListItem: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);

    const changeRole = useCallback((role: AssignmentUpdateTORoleEnum) => {
        updateUserAssignment(props.assignmentTO.repositoryId, props.assignmentTO.userId, props.assignmentTO.username, role)
            .then(response => {
                if(Math.floor(response.status / 100) === 2){
                    dispatch({type: SYNC_STATUS_ASSIGNMENT, dataSynced: false });
                } else{
                    helpers.makeErrorToast(response.data.toString(), () => changeRole(role))
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => changeRole(role))
            })
    }, [dispatch, props.assignmentTO.repositoryId, props.assignmentTO.userId, props.assignmentTO.username, t]);


    const removeUser = useCallback(() => {
        deleteAssignment(props.assignmentTO.repositoryId, props.assignmentTO.username)
            .then(response => {
                if(Math.floor(response.status / 100) === 2){
                    helpers.makeSuccessToast(t("assignment.removed", {username: props.assignmentTO.username}))
                    dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: false });
                } else {
                    helpers.makeErrorToast(t("error.unknown"), () => removeUser())
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => removeUser())
            })

    }, [dispatch, props.assignmentTO.repositoryId, props.assignmentTO.username, t]);

    const options: DropdownButtonItem[] = [
        {
            id: "Owner",
            label: t("user.OWNER"),
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnum.Owner);
            }
        },
        {
            id: "Admin",
            label: t("user.ADMIN"),
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnum.Admin);
            }
        },
        {
            id: "Member",
            label: t("user.MEMBER"),
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnum.Member);
            }
        },
        {
            id: "Viewer",
            label: t("user.VIEWER"),
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnum.Viewer);
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
                    secondary={t(`user.${props.assignmentTO.role}`)} />
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
