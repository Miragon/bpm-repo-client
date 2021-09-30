import React, {useCallback, useRef, useState} from "react";
import {Divider, IconButton, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {Settings} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {AxiosResponse} from "axios";
import {SYNC_STATUS_ASSIGNMENT} from "../../constants/Constants";
import helpers from "../../util/helperFunctions";
import {DropdownButtonItem} from "./Form/DropdownButton";
import PopupSettings from "./Form/PopupSettings";
import {AssignmentTORoleEnum, TeamAssignmentTORoleEnum} from "../../api";

interface Props {
    assignmentTargetId: string;
    assignmentTargetEntity: "team" | "repository";
    userId: string;
    username: string;
    role: TeamAssignmentTORoleEnum | AssignmentTORoleEnum;
    hasAdminPermissions: boolean;
    updateAssignmentMethod: (targetId: string, userId: string, role: any) => Promise<AxiosResponse>;
    deleteAssignmentMethod: (targetId: string, userId: string) => Promise<AxiosResponse>;
}


const UserListItem: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);

    const changeRole = useCallback(role => {
        props.updateAssignmentMethod(props.assignmentTargetId, props.userId, role)
            .then(response => {
                if(Math.floor(response.status / 100) === 2){
                    dispatch({type: SYNC_STATUS_ASSIGNMENT, dataSynced: false });
                } else{
                    helpers.makeErrorToast(response.data.toString(), () => changeRole(role))
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => changeRole(role))
            })
    }, [dispatch, props, t]);


    const removeUser = useCallback(() => {
        props.deleteAssignmentMethod(props.assignmentTargetId, props.userId)
            .then(response => {
                if(Math.floor(response.status / 100) === 2){
                    helpers.makeSuccessToast(t("assignment.removed", {username: props.username}))
                    dispatch({ type: SYNC_STATUS_ASSIGNMENT, dataSynced: false });
                } else {
                    helpers.makeErrorToast(t("error.unknown"), () => removeUser())
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => removeUser())
            })

    }, [dispatch, props, t]);

    const options: DropdownButtonItem[] = [
        {
            id: "Owner",
            label: t("user.OWNER"),
            type: "button",
            onClick: () => {
                changeRole((props.assignmentTargetEntity === "repository") ? AssignmentTORoleEnum.Owner : TeamAssignmentTORoleEnum.Owner);
            }
        },
        {
            id: "Admin",
            label: t("user.ADMIN"),
            type: "button",
            onClick: () => {
                changeRole((props.assignmentTargetEntity === "repository") ? AssignmentTORoleEnum.Admin : TeamAssignmentTORoleEnum.Admin);
            }
        },
        {
            id: "Member",
            label: t("user.MEMBER"),
            type: "button",
            onClick: () => {
                changeRole((props.assignmentTargetEntity === "repository") ? AssignmentTORoleEnum.Member : TeamAssignmentTORoleEnum.Member);
            }
        },
        {
            id: "Viewer",
            label: t("user.VIEWER"),
            type: "button",
            onClick: () => {
                changeRole((props.assignmentTargetEntity === "repository") ? AssignmentTORoleEnum.Viewer : TeamAssignmentTORoleEnum.Viewer);
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
                    primary={props.username}
                    secondary={t(`user.${props.role}`)} />
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
