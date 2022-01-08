import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import Popup from "../Common/Popup";

const useStyles = makeStyles((theme: Theme) => ({
    popper: {
        marginTop: "0.5rem",
        cursor: "default"
    }
}));

interface Props {
    anchor: HTMLElement | undefined;
    onClose: () => void;
    children: ((props: {
        close: () => void;
    }) => React.ReactNode);
}

const FileListPopup: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <Popup
            background="#FFFFFF"
            placement="top-end"
            anchor={props.anchor}
            onClose={props.onClose}
            className={classes.popper}>
            {props.children}
        </Popup>
    );
};

export default FileListPopup;
