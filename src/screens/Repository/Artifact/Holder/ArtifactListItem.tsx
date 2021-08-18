import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ArtifactTypeTO, ArtifactVersionTO} from "../../../../api";
import {RootState} from "../../../../store/reducers/rootReducer";
import {CircularProgress, Collapse, ListItem, Tooltip} from "@material-ui/core";
import {ExpandLess, ExpandMore, MoreVert, Star, StarOutline} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import PopupSettings from "../../../../components/Form/PopupSettings";
import {DropdownButtonItem} from "../../../../components/Form/DropdownButton";
import {
    addToFavorites,
    deleteArtifact,
    fetchRepositories,
    getAllVersions,
    getLatestVersion,
    shareWithRepo
} from "../../../../store/actions";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import helpers from "../../../../constants/Functions";
import {openFileInTool} from "../../../../components/Redirect/Redirections";
import CopyToRepoDialog from "../../../Dialogs/CopyToRepoDialog";
import {ACTIVE_VERSIONS, LATEST_VERSION} from "../../../../constants/Constants";
import VersionDetails from "../../Version/VersionDetails";
import CreateVersionDialog from "../Dialogs/CreateVersionDialog";
import EditArtifactDialog from "../Dialogs/EditArtifactDialog";

const useStyles = makeStyles(() => ({
    listItem: {
        backgroundColor: "white",
        color: "black",
        paddingLeft: "0px",
        paddingRight: "5px",
        borderRadius: "2px",
        border: "1px solid lightgrey",
        minHeight: "60px",
        maxHeight: "60px",
        fontSize: "1rem",
    },
    leftPanel: {
        minWidth: "50px",
        maxWidth: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    middlePanel: {
        flexGrow: 1,
        paddingLeft: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignSelf: "center"
    },
    rightPanel: {
        marginLeft: "15px",
        whiteSpace: "nowrap",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    icons: {
        color: "black",
    },
    contentContainer: {
        width: "100%",
        minHeight: "60px",
        maxHeight: "60px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    text: {
        display: "flex",
        flexDirection: "row",

    },
    title: {
        flexGrow: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxBlockSize: "1.2rem",
        fontWeight: "bold",
        marginBottom: "0.3rem",
    },
    description: {
        flexGrow: 2,
        overflow: "hidden",
        maxWidth: "60%",
        minWidth: "60%",
        fontSize: ".9rem",
        textOverflow: "ellipsis",
        maxBlockSize: "1.2rem",
        fontStyle: "italic",
        color: "grey"
    },
    collapsible: {
        margin: "0px",
        padding: "0px"
    },
    starPositive: {
        color: "#F5E73D",
        zIndex: 50,
        marginLeft: "10px",
        marginRight: "4px",
        transition: "color .3s",
        "&:hover": {
            color: "white"
        }
    },
    starNegative: {
        color: "lightgrey",
        marginLeft: "10px",
        marginRight: "4px",
        transition: "background-image .3s",
        zIndex: 50,
        "&:hover": {
            backgroundImage: "radial-gradient(#F5E73D, transparent 70%)"
        }
    },

}));

interface Props {
    artifactTitle: string;
    createdDate: string | undefined;
    updatedDate: string | undefined;
    description: string;
    repoId: string;
    artifactId: string;
    fileType: string;
    favorite: boolean;
}


const ArtifactListItem: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const ref = useRef<HTMLButtonElement>(null);
    const {t} = useTranslation("common");


    const activeArtifactVersionTOs: Array<ArtifactVersionTO> = useSelector((state: RootState) => state.versions.activeVersions);
    const latestVersion: ArtifactVersionTO | null = useSelector((state: RootState) => state.versions.latestVersion);
    const versionSynced: boolean = useSelector((state: RootState) => state.dataSynced.versionSynced)
    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);


    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [copyToRepoOpen, setCopyToRepoOpen] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [createVersionOpen, setCreateVersionOpen] = useState<boolean>(false);
    const [editArtifactOpen, setEditArtifactOpen] = useState<boolean>(false);
    const [downloadReady, setDownloadReady] = useState<boolean>(false);
    const [svgKey, setSvgKey] = useState<string>("");


    useEffect(() => {
        if(fileTypes && props.fileType){
            const svgIcon = fileTypes.find(fileType => fileType.name === props.fileType)?.svgIcon;
            console.log("loaded")
            setSvgKey(svgIcon ? svgIcon: "");
        }
    }, [fileTypes, props.fileType])

    useEffect(() => {

        if(activeArtifactVersionTOs){
            if(activeArtifactVersionTOs[0]?.artifactId === props.artifactId){
                setOpen(true)
                setLoading(false)
            }
            else{
                setOpen(false)
            }
        }

    }, [activeArtifactVersionTOs, props.artifactId])

    useEffect(() => {
        if(!versionSynced && open){
            dispatch(getAllVersions(props.artifactId))
        }
    }, [versionSynced, open, dispatch, props.artifactId])

    const handleOpenVersions = () => {
        if(!open){
            setOpen(!open);
            console.log("Displaying Loading")
            dispatch(getAllVersions(props.artifactId))
        }
        else {
            setOpen(!open);
            dispatch({type: ACTIVE_VERSIONS, artifacts: []})
        }
    }

    const handleOpenSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setSettingsOpen(true);
    }

    const download = (useCallback((latestVersion: ArtifactVersionTO) => {
        if(downloadReady) {
            console.log("file Ready - starting download...")
            const filePath = `/api/version/${latestVersion.artifactId}/${latestVersion.id}/download`
            const link = document.createElement("a");
            link.href = filePath;
            link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
            link.click();
            dispatch({type: LATEST_VERSION, latestVersion: null})
            setDownloadReady(false)
        }
    }, [downloadReady, dispatch]))

    useEffect(() => {
        if(latestVersion){
            download(latestVersion);
        }
    }, [download, latestVersion])

    const setStarred = (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();
        dispatch(addToFavorites(props.artifactId));
    }

    const options: DropdownButtonItem[] = [

        {
            id: "OpenLatest",
            label: t("version.openLatest"),
            type: "button",
            onClick: () => {
                openFileInTool(fileTypes, props.fileType, props.repoId, props.artifactId, t("error.missingTool", props.fileType))
            }
        },
        {
            id: "CreateVersion",
            label: t("version.create"),
            type: "button",
            onClick: () => {
                dispatch(getLatestVersion(props.artifactId))
                setCreateVersionOpen(true);
            }
        },
        {
            id: "EditArtifact",
            label: t("artifact.edit"),
            type: "button",
            onClick: () => {
                setEditArtifactOpen(true);
            }
        },
        {
            id: "ShareWithRepository",
            label: t("artifact.share"),
            type: "button",
            onClick: () => {
                dispatch(shareWithRepo(props.artifactId, ["760f9b08-f4fd-4533-9d82-ef175f639bf3"]))
            }
        },
        {
            id: "DownloadArtifact",
            label: t("artifact.download"),
            type: "button",
            onClick: () => {
                dispatch(getLatestVersion(props.artifactId))
                setDownloadReady(true)
            }
        },
        {
            id: "CopyToRepository",
            label: t("artifact.copyTo"),
            type: "button",
            onClick: () => {
                dispatch(fetchRepositories())
                setCopyToRepoOpen(true)
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
            label: t("artifact.delete"),
            type: "button",
            onClick: () => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm(t("artifact.confirmDelete", {artifactName: props.artifactTitle}))) {
                    dispatch(deleteArtifact(props.artifactId));
                }
            }
        }
    ];
    
    return (
        <>
            <ListItem className={classes.listItem} button onClick={() => handleOpenVersions()}>
                <div className={classes.leftPanel}>
                    <Icon className={classes.icons}>{svgKey}</Icon>
                </div>
                <div className={classes.contentContainer}>

                    <div className={classes.middlePanel}>
                        <div className={classes.text}>
                            <div className={classes.title}>
                                {props.artifactTitle}
                            </div>
                            <div className={classes.description}>
                                <Tooltip title={props.description}>
                                    <div>
                                        {props.description}
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    <div className={classes.rightPanel}>
                        {helpers.reformatDate(props.updatedDate)}
                        {props.favorite ?
                            <Star className={classes.starPositive} onClick={event => setStarred(event)}/>
                            :
                            <StarOutline className={classes.starNegative} onClick={event => setStarred(event)}/>

                        }
                        <IconButton size={"small"} ref={ref} onClick={event => handleOpenSettings(event)} >
                            <MoreVert className={classes.icons}/>
                        </IconButton>
                        {open ?
                            <IconButton size={"small"}>
                                <ExpandLess className={classes.icons}/>
                            </IconButton>
                            :
                            <IconButton size={"small"}>
                                <ExpandMore className={classes.icons}/>
                            </IconButton>
                        }
                    </div>

                </div>

            </ListItem>
            {loading ?
                <CircularProgress/>
                :
                <Collapse in={open} timeout={"auto"} unmountOnExit className={classes.collapsible}>
                    <VersionDetails
                        key={props.artifactId}
                        artifactId={props.artifactId}
                        repoId={props.repoId}
                        fileType={props.fileType}
                        artifactVersionTOs={activeArtifactVersionTOs}
                        artifactTitle={props.artifactTitle}
                        loading={loading}/>
                </Collapse>
            }




            <PopupSettings
                open={settingsOpen}
                reference={ref.current}
                onCancel={() => setSettingsOpen(false)}
                options={options} />

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

            <CopyToRepoDialog
                open={copyToRepoOpen}
                onCancelled={() => setCopyToRepoOpen(false)}
                name={props.artifactTitle}
                artifactId={props.artifactId} />
        </>
    );
})

export default ArtifactListItem;