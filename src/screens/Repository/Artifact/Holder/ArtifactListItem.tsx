import { CircularProgress, Collapse, ListItem, Tooltip } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactTypeTO, ArtifactVersionTO } from "../../../../api";
import { ACTIVE_VERSIONS, SYNC_STATUS_VERSION } from "../../../../constants/Constants";
import { getAllVersions } from "../../../../store/actions";
import { RootState } from "../../../../store/reducers/rootReducer";
import helpers from "../../../../util/helperFunctions";
import { openFileInTool } from "../../../../util/Redirections";
import VersionDetails from "../../Version/VersionDetails";

const useStyles = makeStyles(() => ({
    listItem: {
        backgroundColor: "white",
        color: "black",
        paddingLeft: "0px",
        paddingRight: "5px",
        borderRadius: "2px",
        border: "1px solid lightgrey",
        borderBottom: "none",
        minHeight: "60px",
        maxHeight: "60px",
        fontSize: "1rem",
        "&:nth-last-child(1)": {
            borderBottom: "1px solid lightgrey"
        }
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
            color: "#F5E73D",
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
    const { t } = useTranslation("common");

    const activeArtifactVersionTOs: Array<ArtifactVersionTO> = useSelector((state: RootState) => state.versions.activeVersions);
    const versionSynced: boolean = useSelector((state: RootState) => state.dataSynced.versionSynced);
    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [svgKey, setSvgKey] = useState<string>("");

    //fetch the defined filetypes and map the corresponding svgs
    useEffect(() => {
        if (fileTypes && props.fileType) {
            const svgIcon = fileTypes.find(fileType => fileType.name === props.fileType)?.svgIcon;
            setSvgKey(svgIcon || "");
        }
    }, [fileTypes, props.fileType])

    //Check if versions of the current artifact should be displayed
    useEffect(() => {
        if (activeArtifactVersionTOs) {
            if (activeArtifactVersionTOs[0]?.artifactId === props.artifactId) {
                setOpen(true)
                setLoading(false)
            } else {
                setOpen(false)
            }
        }

    }, [activeArtifactVersionTOs, props.artifactId])


    //to fetch all versions of a specific artifact
    const getVersions = useCallback(async (artifactId: string) => {
        getAllVersions(artifactId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: ACTIVE_VERSIONS, activeVersions: response.data });
                dispatch({ type: SYNC_STATUS_VERSION, dataSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getVersions(artifactId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getVersions(artifactId))

        })
    }, [dispatch, t])

    //update the versions list if any changes have been made
    useEffect(() => {
        if (!versionSynced && open) {
            getVersions(props.artifactId)
        }
    }, [versionSynced, open, props.artifactId, getVersions])

    //if user clicks on the listitem
    const handleOpenVersions = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        if (!open) {
            setOpen(!open);
            getVersions(props.artifactId)
        } else {
            setOpen(!open);
            dispatch({ type: ACTIVE_VERSIONS, artifacts: [] })
        }
    }

    return (
        <>
            <ListItem className={classes.listItem} button
                onClick={() => openFileInTool(fileTypes, props.fileType, props.repoId, props.artifactId, t("error.missingTool", props.fileType))}>
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
                        {open ?
                            <IconButton size={"small"} onClick={event => handleOpenVersions(event)}>
                                <ExpandLess className={classes.icons} />
                            </IconButton>
                            :
                            <IconButton size={"small"} onClick={event => handleOpenVersions(event)}>
                                <ExpandMore className={classes.icons} />
                            </IconButton>
                        }
                    </div>

                </div>

            </ListItem>
            {loading ?
                <CircularProgress />
                :
                <Collapse in={open} timeout={"auto"} unmountOnExit className={classes.collapsible}>
                    <VersionDetails
                        key={props.artifactId}
                        artifactId={props.artifactId}
                        repoId={props.repoId}
                        fileType={props.fileType}
                        artifactVersionTOs={activeArtifactVersionTOs}
                        artifactTitle={props.artifactTitle} />
                </Collapse>
            }
        </>
    );
})

export default ArtifactListItem;
