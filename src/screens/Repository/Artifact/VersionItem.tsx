import React, {useRef, useState} from "react";
import {
    Button,
    ClickAwayListener,
    Grow,
    IconButton,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    TableCell,
    TableRow
} from "@material-ui/core";
import {MoreVert} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import {ArtifactVersionTO} from "../../../api/models";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import theme from "../../../theme";
import {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import DeployVersionDialog from "./DeployVersionDialog";
import DeploymentHistory from "./DeploymentHistory";
import {fetchTargets} from "../../../store/actions/deploymentAction";
import clsx from "clsx";
import SaveAsNewArtifactDialog from "./SaveAsNewArtifactDialog";

const useStyles = makeStyles(() => ({
    splitCell: {
        display: "flex",
        justifyContent: "space-between"
    },
    popupContainer: {
        zIndex: 1000
    },
    menuItem: {
        color: theme.palette.secondary.contrastText,
        fontSize: theme.typography.button.fontSize,
        fontWeight: theme.typography.button.fontWeight,
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },
    list: {
        outline: "none"
    },
    more: {
        alignSelf: "flex-end",
        height: "25px",
        width: "25px",
        color: theme.palette.primary.main,
    },
    popup: {
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        backgroundColor: theme.palette.secondary.main,
    },
    deploymentTarget: {
        fontStyle: "italic",
        cursor: "pointer",
        color: theme.palette.primary.dark
    },
    button: {
        textTransform: "none",
        transition: theme.transitions.create("border-radius"),
        "&:hover": {
            backgroundColor: theme.palette.secondary.main
        }
    },
}));

interface Props {
    artifactVersion: ArtifactVersionTO;
    artifactTitle: string;
    fileType: string;
    repoId: string;
}


const VersionItem: React.FC<Props> = ((props: Props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation("common");

    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [historyOpen, setHistoryOpen] = useState<boolean>(false);
    const [deployVersionOpen, setDeployVersionOpen] = useState<boolean>(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);

    const openModeler = (artifactId: string, versionId?: string) => {
        if (versionId) {
            window.open(`/modeler/#/${artifactId}/${versionId}/`, "_blank");
        } else {
            window.open(`/modeler/#/${artifactId}/latest`, "_blank");
        }
    };

    const reformatDate = (date: string | undefined) => {
        if (date) {
            const calendarDate = date.split("T")[0].replace(/-/g, ".");
            calendarDate.replace("-", ".");
            const time = date.split("T")[1].substring(0,5);
            return `${calendarDate}  |  ${time}`;
        }
        return "01.01.2000";
    };

    const openSettings = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setSettingsOpen(true);
    };

    const download = (artifactId: string, versionId: string) => {
        console.log("file Ready - starting download...")
        const path = `/api/version/${artifactId}/${versionId}/download`
        downloadFile(path)
    };

    const downloadFile = (filePath: string) => {
        const link=document.createElement("a");
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
        link.click();
    }

    const openDeploymentHistory = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setHistoryOpen(true);
    }


    const options: DropdownButtonItem[] = [
        {
            id: "DeployVersion",
            label: "version.deploy",
            type: "button",
            onClick: () => {
                dispatch(fetchTargets())
                setDeployVersionOpen(true);

            }
        },
        {
            id: "DownloadVersion",
            label: "version.download",
            type: "button",
            onClick: () => {
                download(props.artifactVersion.artifactId, props.artifactVersion.id);
            }

        },
        {
            id: "DeploymentHistory",
            label: "version.deploymentHistory",
            type: "button",
            onClick: () => {
                setHistoryOpen(true);
            }

        },
        {
            id: "SaveAsNewArtifact",
            label: "version.saveAsNewArtifact",
            type: "button",
            onClick: () => {
                setSaveDialogOpen(true);
            }

        },
    ];
    return (
        <>

            <TableRow
                key={props.artifactVersion.id}
                hover
                onClick={() => openModeler(props.artifactVersion.artifactId, props.artifactVersion.id)}>
                <TableCell
                    component="th"
                    scope="row">
                    <div className={classes.splitCell}>
                        <div>
                            {props.artifactVersion.milestone}
                        </div>
                        {props.artifactVersion.deployments.length > 0 ?
                            <div>
                                <Button
                                    ref={ref}
                                    color="secondary"
                                    className={clsx(classes.button)}
                                    onClick={event => openDeploymentHistory(event)}
                                    variant="contained"
                                    size={"small"}>
                                    {props.artifactVersion.deployments.length > 1 ?
                                        `${props.artifactVersion.deployments.length} ${t("deployment.deployments")}`
                                        :
                                        `${props.artifactVersion.deployments[0].target}`
                                    }
                                </Button>
                            </div>

                            :
                            <div>

                            </div>}

                    </div>
                </TableCell>
                <TableCell>{props.artifactVersion.comment}</TableCell>
                <TableCell>
                    <div className={classes.splitCell}>

                        <div>
                            {reformatDate(props.artifactVersion.updatedDate)}
                        </div>
                        <IconButton ref={ref} size="small" className={classes.more} onClick={event => openSettings(event)}>
                            <MoreVert/>
                        </IconButton>
                    </div>
                </TableCell>
            </TableRow>


            <Popper
                open={settingsOpen}
                anchorEl={ref.current}
                role={undefined}
                transition
                disablePortal
                className={classes.popupContainer}>
                {({TransitionProps}) => (
                    <Grow
                        {...TransitionProps}
                        style={{transformOrigin: "top"}}>
                        <Paper className={classes.popup}>
                            <ClickAwayListener onClickAway={() => setSettingsOpen(false)}>
                                <MenuList className={classes.list}>
                                    {options.map(option => (
                                        <MenuItem
                                            key={option.id}
                                            disabled={option.disabled || option.type !== "button"}
                                            className={classes.menuItem}
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

            <DeployVersionDialog
                open={deployVersionOpen}
                onCancelled={() => setDeployVersionOpen(false)}
                artifactId={props.artifactVersion.artifactId}
                versionId={props.artifactVersion.id}
                versionNumber={props.artifactVersion.milestone} />

            <DeploymentHistory
                versionId={props.artifactVersion.id}
                artifactTitle={props.artifactTitle}
                versionComment={props.artifactVersion.comment}
                milestone={props.artifactVersion.milestone}
                open={historyOpen}
                onCancelled={() => setHistoryOpen(false)}
                deployments={props.artifactVersion.deployments} />

            <SaveAsNewArtifactDialog
                open={saveDialogOpen}
                repoId={props.repoId}
                artifactId={props.artifactVersion.artifactId}
                onCancelled={() => setSaveDialogOpen(false)}
                type={props.fileType === "bpmn" ? props.fileType : "dmn"}
                versionNo={props.artifactVersion.milestone}
                file={props.artifactVersion.xml}/>

        </>
    )
})
export default VersionItem;