import React, { ChangeEvent, useEffect } from "react";
import { PaginationConfig } from "./usePagination";
import { Pagination } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
});

interface Props {
    config: PaginationConfig;
    className?: string;
}

const CustomPagination: React.FC<Props> = props => {
    const classes = useStyles();

    // Make sure we are never on pages that don't exist
    useEffect(() => {
        if (props.config.currentPage >= props.config.totalPages) {
            props.config.onPageChanged(Math.max(0, props.config.totalPages - 1));
        }
    }, [props.config]);

    // show pagination for at least 2 pages
    if (props.config.totalPages === 0 || props.config.totalPages === 1) {
        return null;
    }

    const handleChange = (event: ChangeEvent<unknown>, value: number) => {
        // value -1 => we start counting with 0
        props.config.onPageChanged(Math.max(0, value - 1));
    };

    return (
        <Pagination
            count={props.config.totalPages}
            defaultPage={1}
            siblingCount={1}
            onChange={handleChange}
            className={clsx(classes.root, props.className)} />
    );
};

export default CustomPagination;
