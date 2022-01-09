import { Icon, makeStyles } from "@material-ui/core";
import { CheckCircle, Error } from "@material-ui/icons";
import React from "react";
import theme from "../../theme";


//Styling of the Toast (according to the react-toastify library) is done in Layout. This is just
// the content
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
    toastTypeIcon: {
        color: theme.palette.secondary.contrastText,
        height: "25px",
        width: "25px"
    }
}));

interface Props {
    errorMessage: string;
    isError: boolean;
}

const Toast: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Icon className={classes.toastTypeIcon}>
                {props.isError ? <Error /> : <CheckCircle />}
            </Icon>
            <div className={classes.message}>
                {props.errorMessage}
            </div>
        </div>
    );
};

export default Toast;
