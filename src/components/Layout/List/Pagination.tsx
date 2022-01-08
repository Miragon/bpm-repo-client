import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect } from "react";
import { PaginationConfig } from "../../../util/hooks/usePagination";

interface Props {
    config: PaginationConfig;
    className?: string;
}

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    button: {
        minHeight: "32px",
        minWidth: "32px",
        borderRadius: "8px",
        padding: "4px",
        marginLeft: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    buttonIcon: {
        fontSize: "0.65rem"
    },
    buttonActive: {
        backgroundColor: "rgba(0, 0, 0, 0.1) !important",
        fontWeight: "bold"
    },
    buttonIconLeft: {
        // Required because icon has offset
        marginLeft: "4px",
    }
});

const Pagination: React.FC<Props> = props => {
    const classes = useStyles();

    // Make sure we are never on pages that don't exist
    useEffect(() => {
        if (props.config.currentPage >= props.config.totalPages) {
            props.config.onPageChanged(Math.max(0, props.config.totalPages - 1));
        }
    }, [props.config]);

    if (props.config.totalPages === 0) {
        return null;
    }

    return (
        <div className={clsx(classes.root, props.className)}>
            <Button
                className={classes.button}
                onClick={() => props.config.onPageChanged(Math.max(0, props.config.currentPage - 1))}
                disabled={props.config.currentPage === 0}
                variant="text"
                size="small">
                <ArrowBackIos className={clsx(classes.buttonIcon, classes.buttonIconLeft)} />
            </Button>
            {Array.from({ length: props.config.totalPages }, (v, i) => i).map(page => (
                <Button
                    key={page}
                    className={clsx(
                        classes.button,
                        props.config.currentPage === page && classes.buttonActive
                    )}
                    onClick={() => props.config.onPageChanged(page)}
                    variant="text"
                    size="small">
                    {page + 1}
                </Button>
            ))}
            <Button
                className={classes.button}
                onClick={() => props.config.onPageChanged(Math.min(props.config.totalPages, props.config.currentPage + 1))}
                disabled={props.config.currentPage === props.config.totalPages - 1}
                variant="text"
                size="small">
                <ArrowForwardIos className={classes.buttonIcon} />
            </Button>
        </div>
    );
};

export default Pagination;
