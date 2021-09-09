import { Link } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { MoreVert, Star, StarOutline } from "@material-ui/icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ArtifactTO, ArtifactTypeTO } from "../../api";
import { DropdownButtonItem } from "../Form/DropdownButton";
import PopupSettings from "../Form/PopupSettings";
import {
    COLOR_LINK,
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_FAVORITE
} from "../../constants/Constants";
import { addToFavorites, deleteArtifact, getLatestVersion } from "../../store/actions";
import { RootState } from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";
import { openFileInTool } from "../../util/Redirections";
import CreateVersionDialog from "../../screens/Repository/Artifact/Dialogs/CreateVersionDialog";
import EditArtifactDialog from "../../screens/Repository/Artifact/Dialogs/EditArtifactDialog";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "60px",
        padding: "4px 8px 4px 4px",
        display: "flex",
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
        }
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
    }
}));

interface Props {
    artifact: ArtifactTO;
    favorite: boolean;
    repository: string;
}

const ArtifactEntry: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const ref = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation("common");

    const fileTypes: ArtifactTypeTO[] = useSelector((state: RootState) => state.artifacts.fileTypes);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [createVersionOpen, setCreateVersionOpen] = useState(false);
    const [editArtifactOpen, setEditArtifactOpen] = useState(false);

    const icon = useMemo(
        () => fileTypes.find(ft => ft.name === props.artifact.fileType)?.svgIcon,
        [fileTypes, props.artifact]
    );

    const handleOpenSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setSettingsOpen(true);
    }

    const switchStarred = useCallback(async () => {
        const response = await addToFavorites(props.artifact.id);
        if (Math.floor(response.status / 100) === 2) {
            dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
            dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: false })
        } else {
            helpers.makeErrorToast(t("artifact.couldNotSetStarred"), switchStarred)
        }
    }, [props.artifact.id, dispatch, t]);

    const download = useCallback(async () => {
        const response = await getLatestVersion(props.artifact.id);
        if (Math.floor(response.status / 100) === 2) {
            helpers.download(response.data)
            helpers.makeSuccessToast(t("download.started"))
        } else {
            helpers.makeErrorToast(t(response.data.toString()), download)
        }
    }, [props.artifact.id, t]);

    const options: DropdownButtonItem[] = useMemo(() => [
        {
            id: "ShowInRepo",
            label: t("artifact.showInRepo"),
            type: "button",
            onClick: () => history.push(`/repository/${props.artifact.repositoryId}`)
        },
        {
            id: "EditArtifact",
            label: t("artifact.edit"),
            type: "button",
            onClick: () => setEditArtifactOpen(true)
        },
        {
            id: "DownloadArtifact",
            label: t("artifact.download"),
            type: "button",
            onClick: download
        },
        {
            id: "divider1",
            type: "divider",
            label: ""
        },
        {
            id: "DeleteArtifact",
            label: t("artifact.delete"),
            type: "button",
            onClick: async () => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm(t("artifact.confirmDelete", { artifactName: props.artifact.name }))) {
                    try {
                        const [response] = await Promise.all([dispatch(deleteArtifact(props.artifact.id))]);
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if (response?.status === 200) {
                            helpers.makeSuccessToast(t("artifact.deleted"))
                        } else {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            helpers.makeErrorToast(t(response.data), () => this())
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        }
    ], [dispatch, download, history, props.artifact, t]);

    return (
        <>
            <div className={classes.root}>

                <div className={classes.iconContainer}>
                    <Icon>{icon}</Icon>
                </div>

                <div className={classes.textContainer}>
                    <Link
                        href="#"
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
                            {t("artifact.updatedDuration", { duration: helpers.formatTimeSince(props.artifact.updatedDate, t) })}
                        </span>
                    </div>
                </div>

                <div className={classes.menuContainer}>
                    {props.favorite && (
                        <Star
                            className={classes.starActive}
                            onClick={switchStarred} />
                    )}
                    {!props.favorite && (
                        <StarOutline
                            className={classes.starInactive}
                            onClick={switchStarred} />
                    )}
                    <IconButton size={"small"} ref={ref}
                        onClick={event => handleOpenSettings(event)}>
                        <MoreVert />
                    </IconButton>
                </div>

            </div>

            <PopupSettings
                open={settingsOpen}
                reference={ref.current}
                onCancel={() => setSettingsOpen(false)}
                options={options} />

            <CreateVersionDialog
                open={createVersionOpen}
                onCancelled={() => setCreateVersionOpen(false)}
                onCreated={() => setCreateVersionOpen(false)}
                artifactId={props.artifact.id}
                artifactTitle={props.artifact.name} />

            <EditArtifactDialog
                open={editArtifactOpen}
                onCancelled={() => setEditArtifactOpen(false)}
                repoId={props.artifact.repositoryId}
                artifactId={props.artifact.id}
                artifactName={props.artifact.name}
                artifactDescription={props.artifact.description} />
        </>
    );
};

export default ArtifactEntry;
