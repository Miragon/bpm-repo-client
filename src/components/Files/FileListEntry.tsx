import { Card, IconButton, Tooltip, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { MoreVertOutlined, StarOutlined, StarOutlineOutlined } from "@material-ui/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { THEME } from "../../theme";
import { formatTimeSince } from "../../util/DateUtils";
import FileIcon from "./FileIcon";

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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEditor(t: any, fileType: string): string {
    // supported file types are bpmn, dmn and form
    if (fileType.toUpperCase() === "BPMN" || fileType.toUpperCase() === "DMN" || fileType.toUpperCase() === "FORM") {
        return t(`artifact.editorTooltip.${fileType.toUpperCase()}`);
    }
    return t("artifact.editorTooltip.FALLBACK");
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
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    cardMainSectionText: {
        display: "flex",
        flexDirection: "column"
    },
    cardSecondarySection: {
        width: "150px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight: "2rem"
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
    cardActionFavorite: {
        marginRight: "0.5rem",
        "&>span>svg": {
            fill: THEME.content.primary
        }
    },
    cardActionMenu: {},
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
    },
    timeSince: {
        fontSize: "0.75rem",
        fontWeight: 400,
        color: "rgba(0, 0, 0, 0.54)",
        width: "100%",
        textAlign: "right"
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

    return (
        <Tooltip title={getEditor(t, props.file.fileType)}>
            <Card
                onClick={props.onClick}
                className={classes.root}>

                <div className={classes.cardMainSection}>
                    <div className={classes.cardIconWrapper}>
                        <FileIcon
                            color={THEME.content.primary}
                            iconColor="white"
                            type={props.file.fileType} />
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
                            {props.file.repository?.name ?? t("artifact.unknownRepository")}
                        </Typography>
                    </div>
                </div>

                <div className={classes.cardSecondarySection}>
                    <Typography
                        variant="body1"
                        className={classes.timeSince}>
                        {formatTimeSince(props.file.updatedDate, t)}
                    </Typography>
                </div>

                <div className={classes.cardActionSection}>

                    <IconButton
                        size="small"
                        className={classes.cardActionFavorite}
                        onClick={e => {
                            e.stopPropagation();
                            props.onFavorite(!props.file.favorite);
                        }}>
                        {props.file.favorite ? <StarOutlined /> : <StarOutlineOutlined />}
                    </IconButton>

                    <IconButton
                        size="small"
                        className={classes.cardActionMenu}
                        onClick={e => {
                            e.stopPropagation();
                            props.onMenuClicked(e.currentTarget);
                        }}>
                        <MoreVertOutlined />
                    </IconButton>

                </div>

            </Card>
        </Tooltip>
    );
};

export default FileListEntry;
