import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";

interface Props {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPage: (page: number) => void;
}

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: "1rem"
    },
    textButton: {
        textTransform: "none",
        padding: "4px"
    },
    textButtonLeft: {
        paddingRight: "0.5rem",
        "&>span>span": {
            marginRight: "2px"
        }
    },
    textButtonRight: {
        paddingLeft: "0.5rem",
        "&>span>span": {
            marginLeft: "2px"
        }
    },
    textButtonIcon: {
        height: "14px",
        width: "14px",
        marginBottom: "2px"
    },
    numberButton: {
        minWidth: "32px",
        borderRadius: "4px",
        padding: "4px",
        margin: "0 2px"
    },
    numberButtonActive: {
        backgroundColor: "rgba(0, 0, 0, 0.1) !important",
        fontWeight: "bold"
    }
});

const Pagination: React.FC<Props> = props => {
    const classes = useStyles();

    const totalPages = Math.max(Math.ceil(props.totalItems / props.itemsPerPage), 1);

    if (props.totalItems === 0) {
        return null;
    }

    return (
        <div className={classes.root}>
            <Button
                startIcon={<ArrowBackIos className={classes.textButtonIcon} />}
                variant="text"
                size="small"
                className={clsx(classes.textButton, classes.textButtonLeft)}
                onClick={() => props.onPage(Math.max(0, props.currentPage - 1))}
                disabled={props.currentPage === 0}>
                Vorherige
            </Button>
            {Array.from({ length: totalPages }, (v, i) => i).map(page => (
                <Button
                    className={clsx(
                        classes.numberButton,
                        props.currentPage === page && classes.numberButtonActive
                    )}
                    onClick={() => props.onPage(page)}
                    variant="text"
                    size="small">
                    {page + 1}
                </Button>
            ))}
            <Button
                endIcon={<ArrowForwardIos className={classes.textButtonIcon} />}
                variant="text"
                size="small"
                className={clsx(classes.textButton, classes.textButtonRight)}
                onClick={() => props.onPage(Math.min(totalPages, props.currentPage + 1))}
                disabled={props.currentPage === totalPages - 1}>
                Nächste
            </Button>
        </div>
    );
};

export default Pagination;
