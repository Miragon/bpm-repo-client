import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ArtifactVersionTO, FileTypesTO} from "../../../api";
import {RootState} from "../../../store/reducers/rootReducer";
import {Collapse, ListItem, ListItemIcon, Tooltip} from "@material-ui/core";
import {ExpandLess, ExpandMore, MoreVert, Star, StarOutline} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import PopupSettings from "../../../components/Form/PopupSettings";
import {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import * as artifactAction from "../../../store/actions";
import {deleteArtifact, getAllVersions, getLatestVersion} from "../../../store/actions";
import IconButton from "@material-ui/core/IconButton";
import CreateVersionDialog from "./CreateVersionDialog";
import EditArtifactDialog from "./EditArtifactDialog";
import {ACTIVE_VERSIONS, LATEST_VERSION} from "../../../store/constants";
import Icon from "@material-ui/core/Icon";
import helpers from "../../../constants/Functions";
import VersionDetails from "./VersionDetails";

const useStyles = makeStyles(() => ({
    listItem: {
        backgroundColor: "white",
        color: "black",
        borderRadius: "2px",
        border: "1px solid lightgrey",
        transition: "boxShadow .3s",
        minHeight: "60px",
        maxHeight: "60px",
        fontSize: "1rem",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 4px;",

        "&:hover": {
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;"
        }
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
    rightPanel: {
        marginLeft: "15px",
        whiteSpace: "nowrap",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    middlePanel: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignSelf: "center"
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
    expandIcon: {
        position: "absolute",
        left: "50%",
        bottom: "0px",
        color: "lightgrey"
    },
    collapsible: {
        margin: "0px",
        padding: "0px"
    },
    starPositive: {
        color: "#F5E73D",
        zIndex: 50,
        marginLeft: "10px",
        transition: "color .3s",
        "&:hover": {
            color: "white"
        }
    },
    starNegative: {
        color: "lightgrey",
        marginLeft: "10px",
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


    const artifactVersionTOs: Array<ArtifactVersionTO> = useSelector((state: RootState) => state.versions.versions);
    const latestVersion: ArtifactVersionTO | null = useSelector((state: RootState) => state.versions.latestVersion);
    const versionSynced: boolean = useSelector((state: RootState) => state.dataSynced.versionSynced)
    const fileTypes: Array<FileTypesTO> = useSelector((state: RootState) => state.artifacts.fileTypes);


    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [createVersionOpen, setCreateVersionOpen] = useState<boolean>(false);
    const [editArtifactOpen, setEditArtifactOpen] = useState<boolean>(false);
    const [downloadReady, setDownloadReady] = useState<boolean>(false);
    const [svgKey, setSvgKey] = useState<string>("");


    useEffect(() => {
        if(fileTypes && props.fileType){
            const svgIcon = fileTypes.find(fileType => fileType.name === props.fileType)?.svgIcon;
            setSvgKey(svgIcon ? svgIcon: "");
        }
    }, [fileTypes, props.fileType])

    useEffect(() => {
        if(artifactVersionTOs){
            setOpen(artifactVersionTOs[0]?.artifactId === props.artifactId)
            setLoading(false)
        }
    }, [artifactVersionTOs, props.artifactId])

    useEffect(() => {
        if(!versionSynced && open){
            dispatch(getAllVersions(props.artifactId))
        }
    }, [versionSynced, open, dispatch, props.artifactId])

    const handleOpenVersions = () => {
        if(!open){
            setOpen(!open);
            setLoading(true)
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
        dispatch(artifactAction.addToFavorites(props.artifactId));
    }

    const options: DropdownButtonItem[] = [

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
            id: "DownloadArtifact",
            label: t("artifact.download"),
            type: "button",
            onClick: () => {
                dispatch(getLatestVersion(props.artifactId))
                setDownloadReady(true)
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
    
    //                    {open ? <ExpandLess className={classes.expandIcon}/> : <ExpandMore className={classes.expandIcon}/>}
    return (
        <>
            <ListItem className={classes.listItem} button onClick={() => handleOpenVersions()}>
                <ListItemIcon>
                    <Icon className={classes.icons}>{svgKey}</Icon>
                </ListItemIcon>

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
                        <IconButton ref={ref} onClick={event => handleOpenSettings(event)} >
                            <MoreVert className={classes.icons}/>
                        </IconButton>
                    </div>
                    {open ? <ExpandLess className={classes.expandIcon}/> : <ExpandMore className={classes.expandIcon}/>}

                </div>

            </ListItem>

            <Collapse in={open} timeout={1} unmountOnExit className={classes.collapsible}>
                <VersionDetails
                    key={props.artifactId}
                    artifactId={props.artifactId}
                    repoId={props.repoId}
                    fileType={props.fileType}
                    artifactVersionTOs={artifactVersionTOs}
                    artifactTitle={props.artifactTitle}
                    loading={loading}/>
            </Collapse>


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
        </>
    );
})

export default ArtifactListItem;