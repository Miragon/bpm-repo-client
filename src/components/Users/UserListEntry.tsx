import { Avatar, Card, IconButton, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { DeleteOutlineOutlined, EditOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { AssignmentTORoleEnum } from "../../api";
import { THEME } from "../../theme";
import { getAvatarColor } from "../Avatars/AvatarList";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        margin: "0.75rem 0",
        borderRadius: "8px",
        padding: "1.25rem",
        boxShadow: "rgba(0, 0, 0, 0.1) -4px 9px 25px -6px",
        border: "1px solid #EAEAEA"
    },
    cardMainSection: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    cardMainSectionText: {
        paddingTop: "4px",
        display: "flex",
        flexDirection: "column"
    },
    cardTagSection: {
        width: "200px",
        display: "flex",
        justifyContent: "flex-end",
        marginRight: "1rem"
    },
    tag: {
        margin: "auto 0.25rem",
        borderRadius: "8px",
        color: "white",
        padding: "2px 4px",
        fontWeight: "bold",
        fontSize: "0.8rem"
    },
    tagPrimary: {
        backgroundColor: THEME.content.primary
    },
    cardActionSection: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    cardIconWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "1rem",
        marginTop: "-1rem",
        marginBottom: "-1rem"
    },
    cardBody: {
        display: "flex",
        flexDirection: "column"
    },
    title: {
        fontSize: "0.85rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    avatar: {
        height: "32px",
        width: "32px",
        fontSize: "0.9rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        borderRadius: "8px"
    }
}));

export interface UserInfo {
    id: string;
    name: string;
    role: AssignmentTORoleEnum;
}

interface Props {
    user: UserInfo;
    onEditClicked: () => void;
    onDeleteClicked: () => void;
}

const UserListEntry: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>

            <div className={classes.cardMainSection}>
                <div className={classes.cardIconWrapper}>
                    <Avatar
                        className={classes.avatar}
                        style={{ backgroundColor: getAvatarColor(props.user.name) }}
                        variant="rounded"
                        alt={props.user.name}>
                        {props.user.name.substr(0, 1)}
                    </Avatar>
                </div>
                <div className={classes.cardMainSectionText}>
                    <Typography
                        variant="body1"
                        title={props.user.name}
                        className={classes.title}>
                        {props.user.name}
                    </Typography>
                </div>
            </div>

            <div className={classes.cardTagSection}>
                <div className={clsx(classes.tag, classes.tagPrimary)}>
                    {props.user.role === AssignmentTORoleEnum.Viewer && "Betrachter"}
                    {props.user.role === AssignmentTORoleEnum.Member && "Mitglied"}
                    {props.user.role === AssignmentTORoleEnum.Admin && "Administrator"}
                    {props.user.role === AssignmentTORoleEnum.Owner && "Eigentümer"}
                </div>
            </div>

            <div className={classes.cardActionSection}>

                <IconButton
                    size="small"
                    onClick={e => {
                        e.stopPropagation();
                        props.onEditClicked();
                    }}>
                    <EditOutlined />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={e => {
                        e.stopPropagation();
                        props.onDeleteClicked();
                    }}>
                    <DeleteOutlineOutlined />
                </IconButton>

            </div>

        </Card>
    );
};

export default UserListEntry;
