import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {ArtifactTypeTO} from "../../../api";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers/rootReducer";
import Icon from "@material-ui/core/Icon";
import {Star, StarOutline} from "@material-ui/icons";
import New from "../../../img/New.svg";
import {Tooltip} from "@material-ui/core";
import {addToFavorites} from "../../../store/actions";

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow .3s",
        minHeight: "300px",
        maxHeight: "300px",
        maxWidth: "300px",
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
        overflow: "hidden"
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
    icons: {
        display: "flex",
        flexDirection: "column",
        minWidth: "25px",
        maxWidth: "25px",
        minHeight: "50px",
        maxHeight: "50px",
        margin: "5px",
    },
    fileType: {
        color: theme.palette.primary.contrastText,
    },
    starPositive: {
        color: "#F5E73D",
        transition: "background-image .3s",
        "&:hover": {
            backgroundImage: "radial-gradient(white, transparent 70%)"
        }
    },    
    starNegative: {
        color: theme.palette.primary.contrastText,
        transition: "background-image .3s",
        "&:hover": {
            backgroundImage: "radial-gradient(#F5E73D, transparent 70%)"
        }
    },
    image: {
        backgroundColor: "#EEE",
        flexGrow: 1,
        overflow: "hidden",
        border: "1px solid #ccc",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
        borderTop: "none"
    },

    emptyImage: {
        backgroundColor: "#EEE",
        border: "1px solid #ccc",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
        borderTop: "none",
        width: "200px",
        height:"200px"
    }

}));

interface ArtifactProps {
    artifactTitle: string;
    image: string | undefined;
    artifactRepo: string;
    fileType: string;
    id: string
    favorite?: boolean;
    className?: string;
}

const ArtifactCard: React.FC<ArtifactProps> = (props: ArtifactProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const image = `data:image/svg+xml;utf-8,${encodeURIComponent(props.image || "")}`;
    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);
    const [svgKey, setSvgKey] = useState<string>("");

    useEffect(() => {
        if(fileTypes && props.fileType){
            const svgIcon = fileTypes.find(fileType => fileType.name === props.fileType)?.svgIcon;
            setSvgKey(svgIcon ? svgIcon : "");
        }
    }, [fileTypes, props.fileType])


    const setStarred = (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();
        dispatch(addToFavorites(props.id));
    }

    return (
        <div className={clsx(classes.container, props.className)}>
            <div className={classes.header}>
                <div className={classes.text}>
                    <span className={classes.repository}>
                        {props.artifactRepo}
                    </span>
                    <Tooltip title={props.artifactTitle}>
                        <span className={classes.title}>
                            {props.artifactTitle}
                        </span>
                    </Tooltip>
                </div>
                <div className={classes.icons}>
                    <Tooltip title={props.fileType} >
                        <Icon className={classes.fileType}>{svgKey}</Icon>
                    </Tooltip>
                    {props.favorite ?
                        <Star className={classes.starPositive} onClick={event => setStarred(event)}/>
                        :
                        <StarOutline className={classes.starNegative} onClick={event => setStarred(event)}/>

                    }
                </div>
            </div>


            {props.image ?
                <img
                    alt="Preview"
                    className={classes.image}
                    src={image} />
                :

                <img
                    alt="New"
                    className={classes.image}
                    src={New} />

            }


        </div>
    );
};

export default ArtifactCard;
