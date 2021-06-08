import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/styles";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@material-ui/core"
import theme from "../../theme";
import {Delete, MoreVert, KeyboardArrowDown, KeyboardArrowUp} from '@material-ui/icons';
import DropdownButton, {DropdownButtonItem} from "../../components/Form/DropdownButton";
import {useDispatch, useSelector} from "react-redux";
import {getAllVersions} from "../../store/actions/versionAction";
import VersionListItem from "./VersionListItem";
import {BpmnDiagramVersionTO} from "../../api/models";
import {RootState} from "../../store/reducers/rootReducer";
import {formatDate} from "@angular/common";
const useStyles = makeStyles(() => ({
    listWithVersions: {
        display: "flex",
        flexDirection: "column",
        marginTop: "10px",
        position: "relative",
        transition: "box-shadow .3s",
        borderRadius: "4px",
        border: "1px solid lightgrey",
        width: "100%",
        "&:hover": {
            boxShadow: theme.shadows[4]
        },
    },
    listItemWithVersions: {
        transition: "box-shadow .3s",
        cursor: "pointer",
        borderRadius: "4px",
        width: "100%",
        height: "200px",
        "&:hover": {
            boxShadow: theme.shadows[4]
        },
    },
    listItem: {
        marginTop: "10px",
        position: "relative",
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
    header: {
        position: "absolute",
        left: "220px",
        width: "calc(100% - 220px)",
        padding: "8px",
        color: "black",
    },
    title: {
        fontWeight: "bold",
        fontSize: "14px",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    updatedDate: {
        position: "absolute",
        right: "100px",
        top: "8px",
        fontWeight: "lighter",
        fontStyle: "italic"
    },
    delete: {
        position: "absolute",
        right: "10px",
        top: "4px",
        height: "25px",
        width: "25px",
        borderRadius: "4px",
        backgroundColor: "white",
        color: "black",
        transition: "background-color, color .3s",
        "&:hover": {
            backgroundColor: "#C40000",
            color: "white"
        }
    },
    description: {
        position: "absolute",
        left: "220px",
        top: "30px",
        padding: "8px",
        color: "black"
    },
    versionsButton: {
        position: "absolute",
        bottom: "0px",
        left: "200px",
        padding: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "calc(100% - 200px)",
        border: "none",
        transition: "background-color .3s",
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: "lightgrey"
        },
    },

    image: {
        backgroundColor: "#EEE",
        height: "100%",
        width: "200px",
        border: "1px solid #ccc",
        borderBottomLeftRadius: "4px",
        borderTopLeftRadius: "4px",
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
}));

interface Props {
    diagramTitle: string;
    image: string | undefined;
    createdDate: string | undefined;
    updatedDate: string | undefined;
    description: string;
    repoId: string;
    diagramId: string;
}

const DiagramListItem: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const image = `data:image/svg+xml;utf-8,${encodeURIComponent(props.image || "")}`;

    const versions: Array<BpmnDiagramVersionTO> = useSelector((state: RootState) => state.versions.versions)
    const [open, setOpen] = useState(false);

    const fetchVersions = useCallback(() => {
        try {
            dispatch(getAllVersions(props.repoId, props.diagramId))
        } catch (err) {
            console.log(err)
        }
    }, [dispatch])


    const reformatDate = (date: string | undefined) => {
        if(date){
            return date.split('T')[0]
        }
        else {
            return "01.01.2000"
        }
    }

    const deleteDiagram = (event: any) => {
        event.stopPropagation()
        console.log("Clicked Delete")
    }

    const openVersions = (event: any): void => {
        event.stopPropagation();
        console.log("querying versions");
        fetchVersions();
        setOpen(true);
    }
    const closeVersions = (event: any): void => {
        event.stopPropagation();
        console.log("querying versions");
        fetchVersions();
        setOpen(false);
    }

    const openModeler = (repoId: string, diagramId: string, versionId: string) => {
        window.open(`/modeler/#/${repoId}/${diagramId}/${versionId}/`, '_blank')?.focus();
    }

    if(open){
        return (
            <div className={classes.listWithVersions}>
            <div className={classes.listItemWithVersions} >
                <div className={classes.header}>
                    <div className={classes.title}>
                        {props.diagramTitle}
                    </div>
                    <div className={classes.updatedDate}>
                        {"modified on " + reformatDate(props.updatedDate)}
                    </div>
                    <div className={classes.delete} onClick={(event) => deleteDiagram(event)}>
                        <Delete/>
                    </div>
                </div>

                <img
                    alt="Preview"
                    className={classes.image}
                    src={image} />
                <div className={classes.description}>
                    {props.description}
                </div>
            </div>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <b>Version</b>
                            </TableCell>
                            <TableCell>
                                <b>Comment</b>
                            </TableCell>
                            <TableCell>
                                <b>Date</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                {versions?.map((singleVersion) => (
                    <TableRow key={singleVersion.bpmnDiagramVersionId} hover={true} onClick={() => openModeler(singleVersion.bpmnRepositoryId, singleVersion.bpmnDiagramId, singleVersion.bpmnDiagramVersionId)}>
                        <TableCell component="th" scope={"row"}>{singleVersion.bpmnDiagramVersionRelease}.{singleVersion.bpmnDiagramVersionMilestone}</TableCell>
                        <TableCell>{singleVersion.bpmnDiagramVersionComment}</TableCell>
                        <TableCell>{reformatDate(singleVersion.updatedDate)}</TableCell>
                    </TableRow>
                ))}

                    </TableBody>
                </Table>
                <div className={classes.versionsButtonClose} onClick={((event) => closeVersions(event))}>
                    <KeyboardArrowUp/>
                </div>
            </div>
        );
    }
    //If versions are not opened:
    else
    return (
        <div className={classes.listItem}>
            <div className={classes.header}>
                <div className={classes.title}>
                    {props.diagramTitle}
                </div>
                <div className={classes.updatedDate}>
                    {"modified on " + reformatDate(props.updatedDate)}
                </div>
                <div className={classes.delete} onClick={(event) => deleteDiagram(event)}>
                    <Delete/>
                </div>
            </div>
            <div className={classes.versionsButton} onClick={(event) => openVersions(event)}>
                <KeyboardArrowDown/>
            </div>
            <img
                alt="Preview"
                className={classes.image}
                src={image} />
            <div className={classes.description}>
                {props.description}
            </div>
        </div>
    );
});
export default DiagramListItem;