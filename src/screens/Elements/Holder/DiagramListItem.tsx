import React, {useCallback, useEffect} from "react";
import {makeStyles} from "@material-ui/styles";
import theme from "../../../theme";

const useStyles = makeStyles(() => ({
    listItem: {
        marginTop: "10px",

        transition: "box-shadow .3s",
        cursor: "pointer",
        borderRadius: "4px",
        width: "100%",
        height: "200px",
        "&:hover": {
            boxShadow: theme.shadows[4]
        },
    },
    header: {
        position: "absolute",
        left: "120px",
        padding: "8px",
        color: "black",
        display: "flex",
        flexDirection: "column"
    },
    title: {
        fontWeight: "bold",
        fontSize: "14px",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    image: {
        backgroundColor: "#EEE",
        height: "100%",
        width: "200px",
        border: "1px solid #ccc",
        borderBottomLeftRadius: "4px",
        borderTopLeftRadius: "4px",
    }
}));

interface Props {
    diagramTitle: string;
    image: string | undefined;
    createdDate: Date | undefined;
    updatedDate: Date | undefined;
    description: string;
}

const DiagramListItem: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();


    const image = `data:image/svg+xml;utf-8,${encodeURIComponent(props.image || "")}`;


    return (
        <div className={classes.listItem}>
            <div className={classes.header}>
                <div className={classes.title}>
                    {props.diagramTitle}
                </div>
            </div>
            <img
                alt="Preview"
                className={classes.image}
                src={image} />
        </div>
    );
});
export default DiagramListItem;