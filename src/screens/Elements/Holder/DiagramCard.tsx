import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
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
        "&:hover": {
            boxShadow: theme.shadows[4]
        }
    },
    header: {
        padding: "8px",
        color: "white",
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
    repository: {
        fontSize: "12px",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
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

interface DiagramProps {
    diagramTitle: string;
    image: string | undefined;
    updatedDate: Date | undefined;
    description: string;
    repositoryId: string;
    diagramRepo: string;
    className?: string;
}

const DiagramCard: React.FC<DiagramProps> = (props: DiagramProps) => {
    const classes = useStyles();

    const image = `data:image/svg+xml;utf-8,${encodeURIComponent(props.image || "")}`;

    return (
        <div className={clsx(classes.container, props.className)}>
            <div className={classes.header}>
                <span className={classes.repository}>
                    {props.diagramRepo}
                </span>
                <span className={classes.title}>
                    {props.diagramTitle}
                </span>
            </div>

            <img
                alt="Preview"
                className={classes.image}
                src={image} />
        </div>
    );
};

export default DiagramCard;
