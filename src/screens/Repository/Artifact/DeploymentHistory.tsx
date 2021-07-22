import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PopupDialog from "../../../components/Form/PopupDialog";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {Deployment} from "../../../api/models";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(() => ({
    spacer: {
        marginTop: "15px"
    }
}));

interface Props {
    versionId: string;
    milestone: number;
    artifactTitle: string;
    versionComment: string;
    open: boolean;
    onCancelled: () => void;
    deployments: Array<Deployment>;
}

const DeploymentHistory: React.FC<Props> = props => {
    const classes = useStyles();



    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        props.deployments.sort(compare);
    }, [props.deployments])

    const compare = (a: Deployment, b: Deployment) => {
        if(a.timestamp < b.timestamp) {
            return -1;
        }
        if(a.timestamp > b.timestamp) {
            return 1;
        }
        return 0;
    }


    const reformatDate = (date: string | undefined) => {
        if (date) {
            const calendarDate = date.split("T")[0].replace(/-/g, ".");
            calendarDate.replace("-", ".");
            const time = date.split("T")[1].substring(0,5);
            return `${calendarDate}  |  ${time}`;
        }
        return "01.01.2000";
    };

    return (
        <PopupDialog
            open={props.open}
            title={t("deployment.history")}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("dialog.close")}
            onFirst={props.onCancelled}>
            <p>
                {t("properties.title")}: <b> {props.artifactTitle} </b>
            </p>
            <p>
                {t("properties.comment")}: <b> {props.versionComment} </b>
            </p>
            <div className={classes.spacer}/>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <b>{t("properties.target")}</b>
                        </TableCell>
                        <TableCell>
                            <b>{t("user.user")}</b>
                        </TableCell>
                        <TableCell>
                            <b>{t("properties.date")}</b>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.deployments?.map(deployment => (
                        <TableRow
                            key={deployment.id}
                            hover >
                            <TableCell
                                component="th"
                                scope="row" >
                                {deployment.target}
                            </TableCell>

                            <TableCell>
                                {deployment.user}
                            </TableCell>
                            <TableCell>
                                {reformatDate(deployment.timestamp)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </PopupDialog>
    );
};

export default DeploymentHistory;