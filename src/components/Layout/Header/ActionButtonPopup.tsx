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
            popupStyle={{
                rotation: 315,
                top: "1px",
                bottom: undefined,
                translateX: "100%",
                translateY: "-50%",
                background: "#FFFFFF",
                transformOrigin: "top",
                right: "30px"
            }}
            popupStyleFlip={{
                rotation: 135,
                top: undefined,
                bottom: "1px",
                translateX: "100%",
                translateY: "-50%",
                transformOrigin: "bottom"
            }}
            placement="bottom-end"
            anchor={props.anchor}
            onClose={props.onClose}
            className={classes.popper}>
            {props.children}
        </Popup>
    );
};

export default ActionButtonPopup;
