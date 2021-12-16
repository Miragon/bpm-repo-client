import React from "react";
import { Icon, IconButton, makeStyles } from "@material-ui/core";
import { CheckCircle, Error, Replay } from "@material-ui/icons";
import theme from "../../theme";

// Styling of the Toast (according to the react-toastify library) is done in Layout. This is just the content
const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center"
    },
    message: {
        flexGrow: 3
    },
    retryButton: {
        color: theme.palette.secondary.contrastText,
        height: "25px",
        width: "25px"
    },
    toastTypeIcon: {
        color: theme.palette.secondary.contrastText,
        height: "25px",
        width: "25px"
    }
}));

interface Props {
    errorMessage: string;
    isError: boolean;
    retryMethod?: () => unknown;
}

const Toast: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            {props.isError
                ? (
                    <Icon className={classes.toastTypeIcon}>
                        <Error />
                    </Icon>
                )
                : (
                    <Icon className={classes.toastTypeIcon}>
                        <CheckCircle />
                    </Icon>
                )}
            <div className={classes.message}>
                {props.errorMessage}
            </div>
            {props.isError
                && (
                    <IconButton
                        className={classes.retryButton}
                        onClick={() => (props.retryMethod ? props.retryMethod() : console.log("Retry not available"))}>
                        <Replay />
                    </IconButton>
                )}
        </div>
    );
};

export default Toast;
