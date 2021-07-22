/* eslint-disable max-len */
import React, {useCallback, useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/styles";
import {
    ClickAwayListener,
    Collapse,
    Grow,
    IconButton,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    SvgIcon
} from "@material-ui/core";
import {KeyboardArrowDown, MoreVert} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import clsx from "clsx";
import theme from "../../../theme";
import {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import {getAllVersions, getLatestVersion} from "../../../store/actions/versionAction";
import {ArtifactVersionTO, FileTypesTO} from "../../../api/models";
import {RootState} from "../../../store/reducers/rootReducer";
import {deleteArtifact} from "../../../store/actions";
import {LATEST_VERSION} from "../../../store/constants";
import CreateVersionDialog from "./CreateVersionDialog";
import EditArtifactDialog from "./EditArtifactDialog";
import {ReactComponent as BpmnIcon} from "../../../img/bpmnIcon_gears.svg";
import VersionDetails from "./VersionDetails";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    listItemWithVersions: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "box-shadow .3s",
        borderRadius: "4px",
        marginTop: "10px",
        border: "1px solid lightgrey",
        width: "100%",
        "&:hover": {
            boxShadow: theme.shadows[4]
        },
    },
    listItem: {
        display: "flex",
        flexDirection: "row",
        transition: "box-shadow .3s",
        cursor: "pointer",
        borderRadius: "4px",
        border: "1px solid lightgrey",
        width: "100%",
        height: "200px",
        "&:hover": {
            boxShadow: theme.shadows[4]
        },
    },
    image: {
        backgroundColor: "#EEE",
        height: "100%",
        width: "200px",
        borderRight: "1px solid #ccc",
        borderBottomLeftRadius: "4px",
        borderTopLeftRadius: "4px",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "200px"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "nowrap",
        padding: "8px",
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
    title: {
        fontWeight: "bold",
        fontSize: "14px",
        marginLeft: "15px",
        flexGrow: 1,
        whiteSpace: "nowrap",
    },
    updatedDate: {
        marginRight: "10px",
        whiteSpace: "nowrap",
        fontWeight: "lighter",
        fontStyle: "italic",
        overflow: "hidden"
    },
    more: {
        alignSelf: "flex-end",
        height: "25px",
        width: "25px",
        color: theme.palette.primary.contrastText,
    },
    description: {
        flexGrow: 1,
        padding: "16px",
        color: "black"
    },
    versionsButton: {
        width: "100%",
        alignSelf: "flex-end",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderBottomRightRadius: "4px",
        transition: "background-color .3s",
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: "lightgrey"
        },
    },
    popupContainer: {
        zIndex: 1000
    },
    popup: {
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        backgroundColor: theme.palette.secondary.main,
    },
    list: {
        outline: "none"
    },
    menuItem: {
        color: theme.palette.secondary.contrastText,
        fontSize: theme.typography.button.fontSize,
        fontWeight: theme.typography.button.fontWeight,
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },

    menuItemDivider: {
        height: "1px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        opacity: "1 !important",
        marginTop: "0.25rem",
        marginBottom: "0.5rem",
        padding: 0
    },
    versionsButtonClose: {
        bottom: "0px",
        width: "100%",
        alignItems: "center",
        transition: "background-color .3s",
        textAlign: "center",
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: "lightgrey"
        },
    },
    fileType: {
        width: "20px",
        height: "20px",
        color: "#FFFFFF",
        textDecoration: "none"
    },
}));

interface Props {
    artifactTitle: string;
    image: string | undefined;
    createdDate: string | undefined;
    updatedDate: string | undefined;
    description: string;
    repoId: string;
    artifactId: string;
    fileType: string;
}

const ArtifactListItem: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");
    const artifactVersionTOs: Array<ArtifactVersionTO> = useSelector((state: RootState) => state.versions.versions);
    const latestVersion: ArtifactVersionTO | null = useSelector((state: RootState) => state.versions.latestVersion);
    const versionSynced: boolean = useSelector((state: RootState) => state.dataSynced.versionSynced)
    const fileTypes: Array<FileTypesTO> = useSelector((state: RootState) => state.artifacts.fileTypes);

    const image = `data:image/svg+xml;utf-8,${encodeURIComponent(props.image || "")}`;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string>("");
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [createVersionOpen, setCreateVersionOpen] = useState<boolean>(false);
    const [editArtifactOpen, setEditArtifactOpen] = useState<boolean>(false);
    const [downloadReady, setDownloadReady] = useState<boolean>(false);
    const [svg, setSvg] = useState<string>("");


    const ref = useRef<HTMLButtonElement>(null);

    const checkIfVersionsAreOpen = useCallback(() => {
        if (artifactVersionTOs) {
            const openedArtifact = artifactVersionTOs[0];
            if (openedArtifact?.artifactId === props.artifactId) {
                setOpen(true);
            } else {
                setOpen(false);
            }
        }
    }, [artifactVersionTOs, props]);

    useEffect(() => {
        // This block checks if th versions of another artifact are being fetched at the moment and if the loading animation has to be displayed
        if (artifactVersionTOs) {
            setCurrentId(artifactVersionTOs[0] ? artifactVersionTOs[0].artifactId : "");
            if (currentId === artifactVersionTOs[0]?.artifactId) {
                setLoading(false);
            }
        }
        /* Runs a check for every ArtifactListItem, as soon as the state changes.
        If the ArtifactId of the version that is currently saved in the state matches the ArtifactId of this ArtifactListItem,
        The Item is expanded and available versions are displayed.
        If the IDs don't match, the list is collapsed
        */
        checkIfVersionsAreOpen();
    }, [artifactVersionTOs, currentId, checkIfVersionsAreOpen]);

    useEffect(() => {
        if(fileTypes && props.fileType){
            setSvg(fileTypes.find(fileType => fileType.name === props.fileType)?.svgIcon)
        }
    }, [fileTypes, props.fileType])

    const downloadFile = (filePath: string) => {
        const link=document.createElement("a");
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
        link.click();
    }


    useEffect(() => {

        if(downloadReady && latestVersion !== null){
            console.log("file Ready - starting download...")
            const path = `/api/version/${props.artifactId}/${latestVersion?.id}/download`
            downloadFile(path)
            dispatch({type: LATEST_VERSION, latestVersion: null})
            setDownloadReady(false)
        }

    }, [downloadReady, latestVersion, props.artifactId, dispatch])




    const fetchVersions = useCallback(() => {
        try {
            dispatch(getAllVersions(props.artifactId));
        } catch (err) {
            console.log(err);
        }
    }, [dispatch, props]);

    useEffect(() => {
        if(!versionSynced && open){
            fetchVersions()
        }
    }, [versionSynced, fetchVersions, open])


    const reformatDate = (date: string | undefined) => {
        if (date) {
            const calendarDate = date.split("T")[0].replace(/-/g, ".");
            calendarDate.replace("-", ".");
            const time = date.split("T")[1].substring(0,5);
            return `${calendarDate}  |  ${time}`;
        }
        return "01.01.2000";
    };

    const removeArtifact = () => {
        dispatch(deleteArtifact(props.artifactId));
    };
    const openSettings = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setSettingsOpen(true);
    };

    const openVersions = (event: React.MouseEvent<HTMLElement>): void => {
        event.stopPropagation();
        setLoading(true);
        fetchVersions();
        setOpen(true);
    };

    const fetchLatestVersion = useCallback(() => {
        dispatch(getLatestVersion(props.artifactId))
        setDownloadReady(true)
    }, [dispatch, props.artifactId])

    const initDownload = () => {
        fetchLatestVersion()
    }

    const openModeler = (repoId: string, artifactId: string, versionId?: string) => {
        if (versionId) {
            window.open(`/modeler/#/${repoId}/${artifactId}/${versionId}/`, "_blank");
        } else {
            window.open(`/modeler/#/${repoId}/${artifactId}/latest`, "_blank");
        }
    };

    const options: DropdownButtonItem[] = [

        {
            id: "CreateVersion",
            label: "version.create",
            type: "button",
            onClick: () => {
                dispatch(getLatestVersion(props.artifactId))
                setCreateVersionOpen(true);
            }
        },
        {
            id: "EditArtifact",
            label: "artifact.edit",
            type: "button",
            onClick: () => {
                setEditArtifactOpen(true);
            }

        },
        {
            id: "DownloadArtifact",
            label: "artifact.download",
            type: "button",
            onClick: () => {
                initDownload();
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
            id: "DeleteArtifact",
            label: "artifact.delete",
            type: "button",
            onClick: () => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm(t("artifact.confirmDelete", {artifactName: props.artifactTitle}))) {
                    removeArtifact();
                }
            }
        }
    ];

    return (
        <>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div className={classes.listItemWithVersions}>
                <div className={classes.listItem} onClick={() => openModeler(props.repoId, props.artifactId)}>
                    <img
                        alt="Preview"
                        className={classes.image}
                        src={image} />
                    <div className={classes.content}>

                        <div className={classes.header}>
                            <div className={classes.fileType}>
                                {svg === "BpmnIcon" ?
                                    <BpmnIcon />
                                    :
                                    <SvgIcon htmlColor={theme.palette.primary.contrastText}>
                                        <path d={svg} />
                                    </SvgIcon>

                                }
                            </div>
                            <div className={classes.title}>
                                {props.artifactTitle}
                            </div>

                            <div className={classes.updatedDate}>
                                {`${t("artifact.modifiedOn")} ${reformatDate(props.updatedDate)}`}
                            </div>
                            <IconButton ref={ref} className={classes.more} onClick={event => openSettings(event)}>
                                <MoreVert />
                            </IconButton>
                        </div>
                        <div className={classes.description}>
                            {props.description}
                        </div>
                        {!open
                        && (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                            <div className={classes.versionsButton} onClick={event => openVersions(event)}>
                                <KeyboardArrowDown />
                            </div>
                        )}
                    </div>
                </div>

                <Collapse in={open} timeout="auto">
                    <VersionDetails
                        artifactId={props.artifactId}
                        repoId={props.repoId}
                        fileType={props.fileType}
                        artifactVersionTOs={artifactVersionTOs}
                        artifactTitle={props.artifactTitle}
                        loading={loading}/>
                </Collapse>

            </div>

            <Popper
                open={settingsOpen}
                anchorEl={ref.current}
                role={undefined}
                transition
                disablePortal
                className={classes.popupContainer}>
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: "top" }}>
                        <Paper className={classes.popup}>
                            <ClickAwayListener onClickAway={() => setSettingsOpen(false)}>
                                <MenuList className={classes.list}>
                                    {options.map(option => (
                                        <MenuItem
                                            key={option.id}
                                            disabled={option.disabled || option.type !== "button"}
                                            className={clsx(
                                                classes.menuItem,
                                                option.type === "divider" && classes.menuItemDivider
                                            )}
                                            onClick={() => {
                                                if (option.onClick) {
                                                    option.onClick();
                                                } else {
                                                    console.log("Some error when clicking");
                                                }
                                                setSettingsOpen(false);
                                            }}>
                                            {t(option.label)}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>

            <CreateVersionDialog
                open={createVersionOpen}
                onCancelled={() => setCreateVersionOpen(false)}
                onCreated={() => setCreateVersionOpen(false)}
                artifactId={props.artifactId}
                artifactTitle={props.artifactTitle} />

            <EditArtifactDialog
                open={editArtifactOpen}
                onCancelled={() => setEditArtifactOpen(false)}
                repoId={props.repoId}
                artifactId={props.artifactId}
                artifactName={props.artifactTitle}
                artifactDescription={props.description} />
        </>
    );
});
export default ArtifactListItem;
