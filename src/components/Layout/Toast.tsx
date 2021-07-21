import React, {useCallback} from "react";
import {Icon, IconButton, makeStyles} from "@material-ui/core";
import {Replay, Error, CheckCircle} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import * as actions from "../../store/actions/actions";
import {ActionType} from "../../store/actions/actions";
import {UNHANDLEDERROR} from "../../store/constants";
import theme from "../../theme";


//Styling of the Toast (according to the react-toastify library) is done in Layout. This is just the content
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
    retryMethod?: ActionType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    retryPayload?: Array<any>;
}

const Toast: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const retry = useCallback(() => {
        if(props.isError && props.retryMethod && props.retryPayload){
            dispatch({type: UNHANDLEDERROR, errorMessage: ""});
            dispatch(actions.actionMapper(props.retryMethod, props.retryPayload));
        }
    }, [dispatch, props]);

    return (
        <div className={classes.container}>
            {props.isError ?
                <Icon className={classes.toastTypeIcon}>
                    <Error/>
                </Icon>
                :
                <Icon className={classes.toastTypeIcon}>
                    <CheckCircle/>
                </Icon>

            }
            <div className={classes.message}>
                {props.errorMessage}
            </div>
            {props.isError &&
                <IconButton
                    className={classes.retryButton}
                    onClick={() => {
                        retry();
                    }}>
                    <Replay/>
                </IconButton>
            }
        </div>
    );
};

export default Toast;
