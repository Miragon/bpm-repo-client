import { Card, IconButton, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CheckBoxOutlined, MoreVertOutlined, StarOutlined } from "@material-ui/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers/rootReducer";
import { THEME } from "../../../theme";
import helperFunctions from "../../../util/helperFunctions";
import FileBpmn from "../../Icons/FileBpmn";
import FileConfiguration from "../../Icons/FileConfiguration";
import FileDmn from "../../Icons/FileDmn";
import AvatarList from "../Avatars/AvatarList";

export interface FileDescription {
    id: string;
    name: string;
    fileType: string;
    description: string;
    createdDate: string;
    updatedDate: string;
    lockedUntil?: string;
    lockedBy?: string;
    favorite: boolean;
    repository?: {
        id: string;
        name: string;
        description: string;
        existingArtifacts: number;
        assignedUsers: number;
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        margin: "0.75rem 0",
        borderRadius: "8px",
        padding: "1.25rem",
        cursor: "pointer",
        transition: theme.transitions.create("box-shadow"),
        boxShadow: "rgba(0, 0, 0, 0.1) -4px 9px 25px -6px",
        border: "1px solid #EAEAEA",
        "&:hover": {
            boxShadow: "rgba(0, 0, 0, 0.25) -4px 9px 25px -6px"
        }
    },
    cardMainSection: {
        width: "55%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    cardMainSectionText: {
        display: "flex",
        flexDirection: "column"
    },
    cardSecondarySection: {
        width: "15%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    cardActionSection: {
        width: "30%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    cardIconWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "4px 4px 4px 4px",
        boxShadow: "rgba(0, 0, 0, 0.1) -4px 9px 25px -6px",
        border: "1px solid #CCC",
        marginRight: "1.5rem",
        marginLeft: "0.5rem",
        height: "2.5rem",
        width: "2rem",
        paddingTop: "0.5rem",
        position: "relative",
        "&::before": {
            borderBottom: "1px solid #CCC",
            backgroundColor: "#F6F8FA",
            transform: "rotate(45deg)",
            width: "16px",
            height: "15px",
            position: "absolute",
            top: "-7px",
            right: "-8px",
            // eslint-disable-next-line
            content: '""'
        }
    },
    cardActionFavorite: {
        marginRight: "0.5rem",
        "&>span>svg": {
            fill: THEME.content.primary
        }
    },
    cardActionMenu: {},
    cardIcon: {
        fontSize: "1.25rem",
        fill: THEME.content.primary
    },
    cardAvatars: {
        marginRight: "1rem"
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
    subtitle: {
        marginTop: "-0.25rem",
        fontSize: "0.75rem",
        fontWeight: 400,
        color: "rgba(0, 0, 0, 0.54)"
    }
}));

interface Props {
    onClick: () => void;
    file: FileDescription;
    onFavorite: (value: boolean) => void;
    onMenuClicked: (target: HTMLButtonElement) => void;
}

const FileListEntry: React.FC<Props> = props => {
    const classes = useStyles();

    const { t } = useTranslation("common");

    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo)

    return (
        <Card
            onClick={props.onClick}
            className={classes.root}
            title={props.file.name}>

            <div className={classes.cardMainSection}>
                <div className={classes.cardIconWrapper}>
                    {props.file.fileType === "BPMN" && (
                        <FileBpmn className={classes.cardIcon} />
                    )}
                    {props.file.fileType === "DMN" && (
                        <FileDmn className={classes.cardIcon} />
                    )}
                    {props.file.fileType === "CONFIGURATION" && (
                        <FileConfiguration className={classes.cardIcon} />
                    )}
                    {props.file.fileType === "FORM" && (
                        <CheckBoxOutlined className={classes.cardIcon} />
                    )}
                </div>
                <div className={classes.cardMainSectionText}>
                    <Typography
                        variant="body1"
                        className={classes.title}>
                        {props.file.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        className={classes.subtitle}>
                        {props.file.repository?.name ?? "Unknown"}
                    </Typography>
                </div>
            </div>

            <div className={classes.cardSecondarySection}>
                <Typography
                    variant="body1"
                    className={classes.subtitle}>
                    {helperFunctions.formatTimeSince(props.file.updatedDate, t)}
                </Typography>
            </div>

            <div className={classes.cardActionSection}>

                <AvatarList
                    className={classes.cardAvatars}
                    names={[currentUser.username, "Test", "Hallo", "Siebzehn"]} />

                <IconButton
                    size="small"
                    className={classes.cardActionFavorite}
                    onClick={() => props.onFavorite(false)}>
                    <StarOutlined />
                </IconButton>

                <IconButton
                    size="small"
                    className={classes.cardActionMenu}
                    onClick={e => props.onMenuClicked(e.currentTarget)}>
                    <MoreVertOutlined />
                </IconButton>

            </div>

        </Card>
    );
};

export default FileListEntry;
