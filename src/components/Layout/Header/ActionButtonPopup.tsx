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

const ActionButtonPopup: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <Popup
            rotation={315}
            top="1px"
            right="30px"
            anchor={props.anchor}
            background="#FFFFFF"
            translateX="100%"
            translateY="-50%"
            onClose={props.onClose}
            placement="bottom-end"
            className={classes.popper}
            transformOrigin="top">
            {props.children}
        </Popup>
    );
};

export default ActionButtonPopup;
