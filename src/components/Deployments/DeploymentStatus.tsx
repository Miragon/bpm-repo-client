import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
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

function getIcon(status: DeploymentTOStatusEnum, classes: any) {
    switch (status) {
        case DeploymentTOStatusEnum.Success:
            return <Done className={classes.success}  />;
        case DeploymentTOStatusEnum.Error:
            return <Error className={classes.error} />;
        case DeploymentTOStatusEnum.Pending:
            return <CircularProgress color="secondary" />;
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

    const { t } = useTranslation("common");

    return (
        <>
            { props.message &&
                <Tooltip title={ props.message }>
                    { getIcon(props.status, classes) }
                </Tooltip>
            }
            { !props.message && getIcon(props.status, classes)}
        </>
    );
};

export default DeploymentStatus;
