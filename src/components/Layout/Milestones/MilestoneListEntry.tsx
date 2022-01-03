import { Card, IconButton, Tooltip, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { MoreVertOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { ArtifactMilestoneTO } from "../../../api";
import { THEME } from "../../../theme";
import helpers from "../../../util/helperFunctions";
import helperFunctions from "../../../util/helperFunctions";

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
        paddingTop: "4px",
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
    cardTagSection: {
        width: "200px",
        display: "flex",
        justifyContent: "flex-end"
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
    tagSecondary: {
        backgroundColor: THEME.content.secondary
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
    cardIcon: {
        backgroundColor: THEME.content.primary,
        borderRadius: "50%",
        height: "2rem",
        width: "2rem",
        color: "white",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
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
    fallback: {
        fontWeight: 500
    },
    timeSince: {
        fontSize: "0.75rem",
        fontWeight: 400,
        color: "rgba(0, 0, 0, 0.54)",
        width: "100%",
        textAlign: "right"
    },
    tooltip: {
        backgroundColor: "black",
        fontSize: "0.85rem"
    },
    tooltipArrow: {
        color: "black"
    }
}));

interface Props {
    onClick: () => void;
    milestone: ArtifactMilestoneTO;
    onMenuClicked: (target: HTMLButtonElement) => void;
}

const MilestoneListEntry: React.FC<Props> = props => {
    const classes = useStyles();

    const { t } = useTranslation("common");

    return (
        <Card
            onClick={props.onClick}
            className={classes.root}>

            <div className={classes.cardMainSection}>
                <div className={classes.cardIconWrapper}>
                    <div className={classes.cardIcon}>
                        {props.milestone.milestone}
                    </div>
                </div>
                <div className={classes.cardMainSectionText}>
                    <Typography
                        variant="body1"
                        title={props.milestone.comment}
                        className={classes.title}>
                        {!props.milestone.comment && (
                            <span className={classes.fallback}>Kein Kommentar</span>
                        )}
                        {props.milestone.comment}
                    </Typography>
                </div>
            </div>

            <div className={classes.cardTagSection}>
                {props.milestone.latestMilestone && (
                    <div className={clsx(classes.tag, classes.tagPrimary)}>
                        Latest
                    </div>
                )}
                {props.milestone.deployments.map(deployment => (
                    <Tooltip
                        arrow
                        key={deployment.id}
                        classes={{ tooltip: classes.tooltip, arrow: classes.tooltipArrow }}
                        title={`${helpers.formatTimeSince(deployment.timestamp, t)} durch ${deployment.user}`}>
                        <div className={clsx(classes.tag, classes.tagSecondary)}>
                            {deployment.target}
                        </div>
                    </Tooltip>
                ))}
            </div>

            <div className={classes.cardSecondarySection}>
                <Typography
                    variant="body1"
                    className={classes.timeSince}>
                    {helperFunctions.formatTimeSince(props.milestone.updatedDate, t)}
                </Typography>
            </div>

            <div className={classes.cardActionSection}>

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
    );
};

export default MilestoneListEntry;
