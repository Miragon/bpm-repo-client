import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {ReactComponent as BpmnIcon} from "../../../img/bpmnIcon_gears.svg";
import {FileTypesTO} from "../../../api/models";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers/rootReducer";
import {SvgIcon} from "@material-ui/core";
import theme from "../../../theme";

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow .3s",
        height: "300px",
        cursor: "pointer",
        marginRight: "0.5rem",
        marginBottom: "0.5rem",
        background: `linear-gradient(to bottom, ${theme.palette.primary.main} 30%, transparent)`,
        borderRadius: "4px",
        textDecoration: "none",
        "&:hover": {
            boxShadow: theme.shadows[4]
        }
    },
    header: {
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    text: {
        padding: "8px",
        display: "flex",
        flexDirection: "column",
    },
    title: {
        fontWeight: "bold",
        fontSize: "14px",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    repository: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: "12px",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    fileType: {
        width: "25px",
        height: "25px",
        margin: "5px",
        color: "#FFFFFF",
        textDecoration: "none"
    },
    image: {
        backgroundColor: "#EEE",
        flexGrow: 1,
        border: "1px solid #ccc",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
        borderTop: "none"
    }

}));

interface ArtifactProps {
    artifactTitle: string;
    image: string | undefined;
    artifactRepo: string;
    fileType: string;
    className?: string;
}

const ArtifactCard: React.FC<ArtifactProps> = (props: ArtifactProps) => {
    const classes = useStyles();

    const image = `data:image/svg+xml;utf-8,${encodeURIComponent(props.image || "")}`;
    const fileTypes: Array<FileTypesTO> = useSelector((state: RootState) => state.artifacts.fileTypes);
    const [svg, setSvg] = useState<string>("");

    useEffect(() => {
        if(fileTypes && props.fileType){
            setSvg(fileTypes.find(fileType => fileType.name === props.fileType)?.svgIcon)
        }
    }, [fileTypes, props.fileType])

    /*
                        {(props.fileType === "dmn") ?
                        <TableChartIcon/>
                        <Icon>{props.fileType}</Icon>
                        :
                        <BpmnIcon/>
     */

    return (
        <div className={clsx(classes.container, props.className)}>
            <div className={classes.header}>
                <div className={classes.text}>
                    <span className={classes.repository}>
                        {props.artifactRepo}
                    </span>
                    <span className={classes.title}>
                        {props.artifactTitle}
                    </span>
                </div>
                    
                <div className={classes.fileType} >
                    {svg === "BpmnIcon" ?
                        <BpmnIcon />
                        :
                        <SvgIcon htmlColor={theme.palette.primary.contrastText}>
                            <path d={svg} />
                        </SvgIcon>

                    }


                </div>

            </div>

            <img
                alt="Preview"
                className={classes.image}
                src={image} />

        </div>
    );
};

export default ArtifactCard;
