import { Card, IconButton, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CloudDownloadOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { ArtifactMilestoneTO, DeploymentTO } from "../../api";
import { THEME } from "../../theme";
import { formatTimeSince } from "../../util/DateUtils";
import FileIcon from "../Files/FileIcon";
import { FileDescription } from "../Files/FileListEntry";

export interface DeploymentInfo {
    artifact: FileDescription | undefined;
    deployment: DeploymentTO;
    milestone: ArtifactMilestoneTO | undefined;
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
    }
}));

interface Props {
    deployment: DeploymentInfo;
    onDownloadClick: () => void;
}

const DeploymentListEntry: React.FC<Props> = props => {
    const classes = useStyles();

    const { t } = useTranslation("common");

    return (
        <Card
            className={classes.root}
            title={props.deployment.artifact?.name}>

            <div className={classes.cardMainSection}>
                <div className={classes.cardIconWrapper}>
                    <FileIcon
                        color={THEME.content.primary}
                        iconColor="white"
                        type={props.deployment.artifact?.fileType} />
                </div>
                <div className={classes.cardMainSectionText}>
                    <Typography
                        variant="body1"
                        className={classes.title}>
                        {props.deployment.artifact?.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        className={classes.subtitle}>
                        Milestone {props.deployment.milestone?.milestone}
                    </Typography>
                </div>
            </div>

            <div className={classes.cardSecondarySection}>
                <Typography
                    variant="body1"
                    className={classes.timeSince}>
                    {formatTimeSince(props.deployment.deployment.timestamp, t)}
                </Typography>
            </div>

            <div className={classes.cardTagSection}>
                <div className={clsx(classes.tag, classes.tagPrimary)}>
                    {props.deployment.deployment.target}
                </div>
            </div>

            <div className={classes.cardActionSection}>

                <IconButton
                    size="small"
                    className={classes.cardActionMenu}
                    onClick={e => {
                        e.stopPropagation();
                        props.onDownloadClick();
                    }}>
                    <CloudDownloadOutlined />
                </IconButton>

            </div>

        </Card>
    );
};

export default DeploymentListEntry;
