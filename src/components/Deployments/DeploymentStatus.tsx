import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { DeploymentTOStatusEnum } from "../../api";
import { Done, Error } from "@material-ui/icons";
import { CircularProgress, Tooltip } from "@material-ui/core";


const useStyles = makeStyles((theme: Theme) => ({
    success: {
        fill: theme.palette.success.main
    },
    error: {
        fill: theme.palette.error.main
    }
}));

interface Props {
    status: DeploymentTOStatusEnum;
    message: string | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getIcon(status: DeploymentTOStatusEnum, classes: any) {
    switch (status) {
        case DeploymentTOStatusEnum.Success:
            return <Done className={classes.success}  />;
        case DeploymentTOStatusEnum.Error:
            return <Error className={classes.error} />;
        case DeploymentTOStatusEnum.Pending:
            return <CircularProgress color="secondary" style={{width: "24px", height: "24px"}} />;
        default:
            return (
                <div>
                    {status}
                </div>
            );
    }
}

const DeploymentStatus: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <Tooltip title={ props.message ?? props.status }>
            { getIcon(props.status, classes) }
        </Tooltip>
    );
};

export default DeploymentStatus;
