import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: (props: Props) => ({
        flexGrow: props.grow ?? 1
    })
}));

interface Props {
    grow?: number;
}

const MenuSpacer: React.FC<Props> = props => {
    const classes = useStyles(props);

    return (
        <div className={classes.root} />
    );
};

export default MenuSpacer;
