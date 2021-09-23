import {Button, Chip, ListItem, Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {MoreVert} from "@material-ui/icons";
import React, {useCallback, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ArtifactTypeTO, DeploymentTO} from "../../../../api";
import {RootState} from "../../../../store/reducers/rootReducer";
import {fetchTargets} from "../../../../store/actions";
import {openFileInTool} from "../../../../util/Redirections";
import helpers from "../../../../util/helperFunctions";
import {TARGETS} from "../../../../constants/Constants";
import {DropdownButtonItem} from "../../../../components/Shared/Form/DropdownButton";
import PopupSettings from "../../../../components/Shared/Form/PopupSettings";
import DeployVersionDialog from "../../../../components/Artifact/Dialogs/DeployVersionDialog";
import DeploymentHistory from "../../../../components/Artifact/Dialogs/DeploymentHistory";
import SaveAsNewArtifactDialog from "../../../../components/Artifact/Dialogs/SaveAsNewArtifactDialog";

const useStyles = makeStyles(() => ({

    listItem: {
        cursor: "pointer",
        backgroundColor: "white",
        paddingLeft: "0px",
        paddingRight: "35px",
        fontSize: "1rem",
        color: "black",
        minHeight: "50px",
        maxHeight: "50px",
        border: "1px solid lightgrey",
        borderBottom: "none",
        transition: "background-color .3s ",
        "&:hover": {
            backgroundColor: "#ededed",
        },
        "&:nth-last-child(1)": {
            borderBottom: "1px solid lightgrey"
        }
    },
    versionNumber: {
        maxWidth: "10%",
        minWidth: "10%",
        fontSize: "1.25rem"
    },
    content: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    leftPanel: {
        minWidth: "50px",
        maxWidth: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    middlePanel: {
        display: "flex",
        flexGrow: 1,
        paddingLeft: "16px",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    rightPanel: {
        display: "flex",
        whiteSpace: "nowrap",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "15px"
    },
    comment: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxBlockSize: "1.5rem"
    },
    deployment: {
        whiteSpace: "nowrap",
        textTransform: "none"

    },

    icons: {
        color: "black",
    },
    date: {
        marginRight: "38px",
    }
}),
);

interface Props {
    artifactTitle: string;
    milestone: number;
    comment?: string;
    updatedDate: string;
    id: string;
    artifactId: string;
    file: string;
    type: string;
    repoId: string;
    deployments: Array<DeploymentTO>
}


const VersionListItem: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const ref = useRef<HTMLButtonElement>(null);
    const {t} = useTranslation("common");


    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [historyOpen, setHistoryOpen] = useState<boolean>(false);
    const [deployVersionOpen, setDeployVersionOpen] = useState<boolean>(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);

    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);

    const openDeploymentHistory = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setHistoryOpen(true);
    }
    
    const getTargets = useCallback(async () => {
        fetchTargets().then(response => {
            if(Math.floor(response.status / 100) === 2) {
                dispatch({type: TARGETS, targets: response.data})
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getTargets())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getTargets())
        })
    }, [dispatch, t])

    const options: DropdownButtonItem[] = [
        {
            id: "DeployVersion",
            label: t("version.deploy"),
            type: "button",
            onClick: () => {
                getTargets()
                setDeployVersionOpen(true);

            }
        },
        {
            id: "DownloadVersion",
            label: t("version.download"),
            type: "button",
            onClick: () => {
                const filePath = `/api/version/${props.artifactId}/${props.id}/download`
                const link = document.createElement("a");
                link.href = filePath;
                link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
                link.click();
            }
        },
        {
            id: "DeploymentHistory",
            label: t("version.deploymentHistory"),
            type: "button",
            onClick: () => {
                setHistoryOpen(true);
            }

        },
        {
            id: "SaveAsNewArtifact",
            label: t("version.saveAsNewArtifact"),
            type: "button",
            onClick: () => {
                setSaveDialogOpen(true);
            }

        },
    ];

    //                <ListItemText primary={props.comment ? props.comment : <i>No comment available</i>} />
    return (
        <>
            <ListItem className={classes.listItem} onClick={() => openFileInTool(fileTypes, props.type, props.repoId, props.artifactId, t("error.missingTool", props.type))}>
                <div className={classes.leftPanel}>
                    <Chip label={props.milestone} color={"primary"}/>
                </div>
                <div className={classes.content}>
                    <div className={classes.middlePanel}>
                        <Tooltip title={props.comment ? props.comment : "No comment available"}>
                            <div className={classes.comment}>
                                {props.comment}
                            </div>
                        </Tooltip>
                        {props.deployments.length > 0 ?
                            <div>
                                <Button
                                    ref={ref}
                                    color="primary"
                                    className={classes.deployment}
                                    onClick={event => openDeploymentHistory(event)}
                                    variant="contained"
                                    aria-multiline={false}
                                    size={"small"}>
                                    {props.deployments.length > 1 ?
                                        `${props.deployments.length} ${t("deployment.deployments")}`
                                        :
                                        `${props.deployments[0].target}`
                                    }
                                </Button>
                            </div>

                            :
                            <div>

                            </div>}
                    </div>

                    <div className={classes.rightPanel}>
                        <div className={classes.date}>
                            {helpers.reformatDate(props.updatedDate)}
                        </div>
                        <IconButton size={"small"} ref={ref} onClick={event =>
                        {
                            event.stopPropagation()
                            setSettingsOpen(true)
                        }} >
                            <MoreVert className={classes.icons}/>
                        </IconButton>
                    </div>
                </div>
            </ListItem>

            <PopupSettings
                open={settingsOpen}
                reference={ref.current}
                onCancel={() => setSettingsOpen(false)}
                options={options} />

            <DeployVersionDialog
                open={deployVersionOpen}
                onCancelled={() => setDeployVersionOpen(false)}
                artifactId={props.artifactId}
                versionId={props.id}
                versionNumber={props.milestone} />

            <DeploymentHistory
                versionId={props.id}
                artifactTitle={props.artifactTitle}
                versionComment={props.comment}
                milestone={props.milestone}
                open={historyOpen}
                onCancelled={() => setHistoryOpen(false)}
                deployments={props.deployments} />

            <SaveAsNewArtifactDialog
                open={saveDialogOpen}
                repoId={props.repoId}
                artifactId={props.artifactId}
                onCancelled={() => setSaveDialogOpen(false)}
                type={props.type}
                versionNo={props.milestone}
                file={props.file}/>
        </>
    );
})

export default VersionListItem