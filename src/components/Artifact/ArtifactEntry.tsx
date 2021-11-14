import {Collapse, Link} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {KeyboardArrowDown, KeyboardArrowUp, MoreVert, Star, StarOutline} from "@material-ui/icons";
import React, {useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {ArtifactTO, ArtifactTypeTO} from "../../api";
import {COLOR_LINK} from "../../constants/Constants";
import {RootState} from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";
import {openFileInTool} from "../../util/Redirections";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        border: "1px solid #CCC",
        "&:not(:last-child)": {
            borderBottom: "none"
        },
        "&:first-child": {
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px"
        },
        "&:last-child": {
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px"
        },
        display: "flex",
        flexDirection: "column"
    },
    summary: {
        height: "60px",
        padding: "4px 8px 4px 4px",
        display: "flex",
    },
    iconContainer: {
        width: "50px",
        color: "rgba(0, 0, 0, 0.54)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    textContainer: {
        flexGrow: 1,
        display: "flex",
        marginLeft: "8px",
        flexDirection: "column",
        justifyContent: "space-between",
        alignSelf: "center"
    },
    title: {
        marginTop: "0.5rem",
        fontSize: "1rem",
        color: COLOR_LINK,
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontWeight: "bold",
        textDecoration: "none"
    },
    subtitle: {
        overflow: "hidden",
        fontSize: "0.8rem",
        textOverflow: "ellipsis",
        color: "rgba(0, 0, 0, 0.54)"
    },
    subtitleText: {
        "&:not(:first-child)": {
            marginLeft: "0.25rem"
        },
        "&:not(:last-child)": {
            marginRight: "0.25rem"
        }
    },
    menuContainer: {
        marginLeft: "16px",
        display: "flex",
        alignItems: "center"
    },
    starActive: {
        color: theme.palette.secondary.main,
        margin: "8px",
        cursor: "pointer",
        transition: theme.transitions.create("color"),
        "&:hover": {
            color: "#AAA",
        }
    },
    starInactive: {
        color: "#AAA",
        margin: "8px",
        cursor: "pointer",
        transition: theme.transitions.create("color"),
        "&:hover": {
            color: theme.palette.secondary.main,
        }
    },
    expandArea: {
        backgroundColor: "#EEE"
    }
}));

interface Props {
    artifact: ArtifactTO;
    favorite: boolean;
    repository: string;
    onFavorite: (artifact: ArtifactTO) => void;
    onMenuClicked: (item: {
        target: Element;
        artifact: ArtifactTO;
        isFavorite: boolean;
        repository: string;
    }) => void;
    expandable?: boolean;
}

const ArtifactEntry: React.FC<Props> = props => {
    const classes = useStyles();
    const ref = useRef<HTMLButtonElement>(null);
    const {t} = useTranslation("common");

    const fileTypes: ArtifactTypeTO[] = useSelector((state: RootState) => state.artifacts.fileTypes);

    const [expanded, setExpanded] = useState(false);

    const icon = useMemo(
        () => fileTypes.find(ft => ft.name === props.artifact.fileType)?.svgIcon,
        [fileTypes, props.artifact]
    );

    return (
        <>
            <div className={classes.root}>

                <div className={classes.summary}>
                    <div className={classes.iconContainer}>
                        <Icon>{icon}</Icon>
                    </div>

                    <div className={classes.textContainer}>
                        <Link
                            onClick={() => openFileInTool(fileTypes, props.artifact.fileType, props.artifact.repositoryId, props.artifact.id, t("error.missingTool", props.artifact.fileType))}
                            className={classes.title}>
                            {props.artifact.name}
                        </Link>
                        <div className={classes.subtitle}>
                            {props.repository && (
                                <>
                                    <span className={classes.subtitleText}>
                                        {props.repository}
                                    </span>
                                    &#8226;
                                </>
                            )}
                            <span className={classes.subtitleText}>
                                {t(`artifact.type.${props.artifact.fileType}`)}
                            </span>
                            &#8226;
                            <span className={classes.subtitleText}>
                                {t("artifact.updatedDuration", {duration: helpers.formatTimeSince(props.artifact.updatedDate, t)})}
                            </span>
                        </div>
                    </div>

                    <div className={classes.menuContainer}>
                        {props.favorite && (
                            <Star
                                className={classes.starActive}
                                onClick={() => props.onFavorite(props.artifact)}/>
                        )}
                        {!props.favorite && (
                            <StarOutline
                                className={classes.starInactive}
                                onClick={() => props.onFavorite(props.artifact)}/>
                        )}
                        <IconButton
                            size={"small"}
                            ref={ref}
                            onClick={event => props.onMenuClicked({
                                artifact: props.artifact,
                                repository: props.repository,
                                target: event.currentTarget,
                                isFavorite: props.favorite
                            })}>
                            <MoreVert/>
                        </IconButton>
                        {props.expandable && (
                            <IconButton
                                size="small"
                                ref={ref}
                                onClick={() => setExpanded(cur => !cur)}>
                                {!expanded && <KeyboardArrowDown/>}
                                {expanded && <KeyboardArrowUp/>}
                            </IconButton>
                        )}
                    </div>
                </div>

                {props.expandable && (
                    <div className={classes.expandArea}>
                        <Collapse
                            mountOnEnter
                            in={expanded}>
                            {props.children}
                        </Collapse>
                    </div>
                )}

            </div>
        </>
    );
};

export default ArtifactEntry;
